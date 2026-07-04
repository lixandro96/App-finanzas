import { movements, editingMovementId, setMovements, setEditingMovementId } from "./state.js";
import { saveMovements } from "./storage.js";
import { getFilteredMovements } from "./filters.js";
import { formatCurrency, formatDate, getToday } from "./utils.js";
import { renderApp } from "./app.js";

const movementsList = document.getElementById("movementsList");

export function renderMovements() {
  movementsList.innerHTML = "";

  const filteredMovements = getFilteredMovements();

  if (filteredMovements.length === 0) {
    movementsList.innerHTML = `
      <p class="empty-message">No hay movimientos para mostrar.</p>
    `;
    return;
  }

  const sortedMovements = [...filteredMovements].reverse();

  sortedMovements.forEach((movement) => {
    const card = document.createElement("div");
    card.classList.add("movement-card", movement.type);

    card.innerHTML = `
      <div class="movement-top">
        <div>
          <p class="movement-title">${movement.concept}</p>
          <p class="movement-details">
            ${movement.type === "income" ? "Ingreso" : "Gasto"} · ${formatDate(movement.date)}
          </p>
        </div>

        <strong class="movement-amount ${movement.type}">
          ${movement.type === "income" ? "+" : "-"}${formatCurrency(movement.amount)}
        </strong>
      </div>

      <div class="movement-details">
        ${
          movement.type === "expense"
            ? `
              <p><strong>Categoría:</strong> ${movement.category}</p>
              <p><strong>Método:</strong> ${movement.paymentMethod}</p>
            `
            : ""
        }
      </div>

      <div class="movement-actions">
        <button class="edit-button" data-action="edit" data-id="${movement.id}">
          Editar
        </button>

        <button class="delete-button" data-action="delete" data-id="${movement.id}">
          Eliminar
        </button>
      </div>
    `;

    movementsList.appendChild(card);
  });
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

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function deleteMovement(id) {
  const confirmDelete = confirm("¿Seguro que quieres eliminar este movimiento?");

  if (!confirmDelete) return;

  const updatedMovements = movements.filter((movement) => movement.id !== id);

  setMovements(updatedMovements);
  saveMovements(updatedMovements);
  renderApp();
}

export function resetForms() {
  const today = getToday();

  document.getElementById("expenseForm").reset();
  document.getElementById("incomeForm").reset();

  document.getElementById("expenseDate").value = today;
  document.getElementById("incomeDate").value = today;

  document.querySelector(".expense-button").textContent = "Guardar gasto";
  document.querySelector(".income-button").textContent = "Guardar ingreso";

  setEditingMovementId(null);
}