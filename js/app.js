import { movements, editingMovementId, setMovements, setEditingMovementId } from "./state.js";
import { saveMovements } from "./storage.js";
import { renderSummary } from "./summary.js";
import { renderMovements, handleMovementActions, resetForms } from "./ui.js";
import { getToday } from "./utils.js";

const expenseForm = document.getElementById("expenseForm");
const incomeForm = document.getElementById("incomeForm");

const tabButtons = document.querySelectorAll(".tab-button");

const clearAllButton = document.getElementById("clearAllButton");
const movementsList = document.getElementById("movementsList");

const monthFilter = document.getElementById("monthFilter");

const openFiltersButton = document.getElementById("openFiltersButton");
const closeFiltersButton = document.getElementById("closeFiltersButton");
const applyFiltersButton = document.getElementById("applyFiltersButton");
const filtersModal = document.getElementById("filtersModal");

const today = getToday();
const currentMonth = today.slice(0, 7);

document.getElementById("expenseDate").value = today;
document.getElementById("incomeDate").value = today;
monthFilter.value = currentMonth;

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTab = button.dataset.tab;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    expenseForm.classList.remove("active");
    incomeForm.classList.remove("active");

    if (selectedTab === "expense") {
      expenseForm.classList.add("active");
    }

    if (selectedTab === "income") {
      incomeForm.classList.add("active");
    }
  });
});

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newExpense = {
    id: crypto.randomUUID(),
    type: "expense",
    category: document.getElementById("expenseCategory").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    concept: document.getElementById("expenseConcept").value.trim(),
    amount: Number(document.getElementById("expenseAmountInput").value),
    date: document.getElementById("expenseDate").value,
  };

  if (editingMovementId) {
    const updatedMovements = movements.map((movement) => {
      if (movement.id === editingMovementId) {
        return {
          ...newExpense,
          id: editingMovementId,
        };
      }

      return movement;
    });

    setMovements(updatedMovements);
    setEditingMovementId(null);
  } else {
    setMovements([...movements, newExpense]);
  }

  saveMovements(movements);
  resetForms();
  renderApp();
});

incomeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newIncome = {
    id: crypto.randomUUID(),
    type: "income",
    concept: document.getElementById("incomeConcept").value.trim(),
    amount: Number(document.getElementById("incomeAmountInput").value),
    date: document.getElementById("incomeDate").value,
  };

  if (editingMovementId) {
    const updatedMovements = movements.map((movement) => {
      if (movement.id === editingMovementId) {
        return {
          ...newIncome,
          id: editingMovementId,
        };
      }

      return movement;
    });

    setMovements(updatedMovements);
    setEditingMovementId(null);
  } else {
    setMovements([...movements, newIncome]);
  }

  saveMovements(movements);
  resetForms();
  renderApp();
});

clearAllButton.addEventListener("click", () => {
  const confirmDelete = confirm("¿Seguro que quieres eliminar todos los movimientos?");

  if (!confirmDelete) return;

  setMovements([]);
  saveMovements([]);
  renderApp();
});

openFiltersButton.addEventListener("click", () => {
  filtersModal.classList.remove("hidden");
});

closeFiltersButton.addEventListener("click", () => {
  filtersModal.classList.add("hidden");
});

applyFiltersButton.addEventListener("click", () => {
  renderApp();
  filtersModal.classList.add("hidden");
});

filtersModal.addEventListener("click", (event) => {
  if (event.target === filtersModal) {
    filtersModal.classList.add("hidden");
  }
});

movementsList.addEventListener("click", handleMovementActions);

export function renderApp() {
  renderSummary();
  renderMovements();
}

renderApp();

