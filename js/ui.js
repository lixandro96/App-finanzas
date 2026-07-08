import { movements, setMovements, setEditingMovementId } from "./state.js";
import { saveMovements } from "./storage.js";
import { getFilteredMovements } from "./filters.js";
import { formatCurrency, formatDate, getToday } from "./utils.js";
import { renderApp } from "./app.js";
import { CATEGORIES } from "./config/categories.js";
import { PAYMENT_METHODS } from "./config/paymentMethods.js";
import { showConfirmModal } from "./components/confirmModal.js";
import { showToast } from "./components/toast.js";

const homeMovementsList = document.getElementById("homeMovementsList");
const movementsList = document.getElementById("movementsList");

export function renderMovements() {
  const filteredMovements = getFilteredMovements();

  renderMovementList({
    container: homeMovementsList,
    movementItems: movements,
    limit: 5,
    showActions: false,
    emptyMessage: "No hay movimientos recientes.",
  });

  renderMovementList({
    container: movementsList,
    movementItems: filteredMovements,
    showActions: true,
    emptyMessage: "No hay movimientos para mostrar.",
  });
}

function renderMovementList({
  container,
  movementItems,
  limit = null,
  showActions = true,
  emptyMessage = "No hay movimientos para mostrar.",
}) {
  container.innerHTML = "";

  if (movementItems.length === 0) {
    container.innerHTML = `
      <p class="empty-message">${emptyMessage}</p>
    `;
    return;
  }

  let sortedMovements = [...movementItems].reverse();

  if (limit) {
    sortedMovements = sortedMovements.slice(0, limit);
  }

  sortedMovements.forEach((movement) => {
    const card = document.createElement("div");
    card.classList.add("movement-card", movement.type);

    card.innerHTML = createMovementCardHTML(movement, showActions);

    container.appendChild(card);
  });
}

function getCategoryInfo(categoryName) {
  return CATEGORIES.find((category) => category.name === categoryName);
}

function getPaymentMethodInfo(methodName) {
  return PAYMENT_METHODS.find((method) => method.name === methodName);
}

function createMovementCardHTML(movement, showActions) {
  const isIncome = movement.type === "income";

  const category = getCategoryInfo(movement.category);
  const paymentMethod = getPaymentMethodInfo(movement.paymentMethod);

  const movementIcon = isIncome ? "⬆️" : category?.icon || "⬇️";
  const movementTypeLabel = isIncome ? "Ingreso" : "Gasto";
  const amountSign = isIncome ? "+" : "-";

  const movementMeta = isIncome
    ? movementTypeLabel
    : `${category?.name || movement.category} · ${paymentMethod?.icon || ""} ${
        paymentMethod?.name || movement.paymentMethod
      }`;

  return `
    <div class="movement-main">
      <div class="movement-icon ${movement.type}">
        ${movementIcon}
      </div>

      <div class="movement-info">
        <p class="movement-title">${movement.concept}</p>
        <p class="movement-details">${movementMeta}</p>
        <p class="movement-date">${formatDate(movement.date)}</p>
      </div>

      <strong class="movement-amount ${movement.type}">
        ${amountSign}${formatCurrency(movement.amount)}
      </strong>
    </div>

    ${
      showActions
        ? `
          <div class="movement-actions">
            <button class="edit-button" data-action="edit" data-id="${movement.id}">
              Editar
            </button>

            <button class="delete-button" data-action="delete" data-id="${movement.id}">
              Eliminar
            </button>
          </div>
        `
        : ""
    }
  `;
}

export function handleMovementActions(event) {
  const button = event.target.closest("button");

  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "edit") {
    editMovement(id);
  }

  if (action === "delete") {
    deleteMovement(id);
  }
}

function editMovement(id) {
  const movement = movements.find((item) => item.id === id);

  if (!movement) return;

  setEditingMovementId(id);

  document.getElementById("movementModal").classList.remove("hidden");
  document.getElementById("movementModalTitle").textContent = "Editar movimiento";

  if (movement.type === "expense") {
    document.querySelector('[data-tab="expense"]').click();

    document.getElementById("expenseCategory").value = movement.category;
    document.getElementById("paymentMethod").value = movement.paymentMethod;
    document.getElementById("expenseConcept").value = movement.concept;
    document.getElementById("expenseAmountInput").value = movement.amount;
    document.getElementById("expenseDate").value = movement.date;

    document.querySelector(".expense-button").textContent = "Actualizar gasto";
  }

  if (movement.type === "income") {
    document.querySelector('[data-tab="income"]').click();

    document.getElementById("incomeConcept").value = movement.concept;
    document.getElementById("incomeAmountInput").value = movement.amount;
    document.getElementById("incomeDate").value = movement.date;

    document.querySelector(".income-button").textContent = "Actualizar ingreso";
  }
}

async function deleteMovement(id) {
  const confirmed = await showConfirmModal({
    title: "Eliminar movimiento",
    message: "Esta acción no se puede deshacer.",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    type: "danger",
  });

  if (!confirmed) return;

  const updatedMovements = movements.filter((movement) => movement.id !== id);

  setMovements(updatedMovements);
  saveMovements(updatedMovements);
  renderApp();

  showToast({
    type: "success",
    message: "Movimiento eliminado",
  });
}

export function resetForms() {
  const today = getToday();

  document.getElementById("expenseForm").reset();
  document.getElementById("incomeForm").reset();

  document.getElementById("expenseDate").value = today;
  document.getElementById("incomeDate").value = today;

  document.querySelector(".expense-button").textContent = "Guardar gasto";
  document.querySelector(".income-button").textContent = "Guardar ingreso";

  document.getElementById("movementModalTitle").textContent = "Nuevo movimiento";

  setEditingMovementId(null);
}
