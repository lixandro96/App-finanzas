import { movements, editingMovementId, setMovements, setEditingMovementId } from "./state.js";
import { saveMovements } from "./storage.js";
import { renderSummary } from "./summary.js";
import { renderMovements, handleMovementActions, resetForms } from "./ui.js";
import { changePage } from "./router.js";
import { loadAppConfiguration } from "./config/configLoader.js";
import { showToast } from "./components/toast.js";
import { getToday, createId } from "./utils.js";
import { showConfirmModal } from "./components/confirmModal.js";
import { renderStatistics, setupStatisticsEvents } from "./pages/statistics.js";
import { renderMorePage } from "./pages/more.js";
import { setupWelcomeEvents, showWelcomeIfNeeded,renderWelcomeScreen } from "./pages/welcome.js";
import { renderHomeHeader } from "./pages/home.js";


const clearFiltersButton = document.getElementById("clearFiltersButton");
const categoryFilter = document.getElementById("categoryFilter");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");

const startDateFilter = document.getElementById("startDateFilter");
const endDateFilter = document.getElementById("endDateFilter");


const openMovementModalButton = document.getElementById("openMovementModalButton");
const closeMovementModalButton = document.getElementById("closeMovementModalButton");
const movementModal = document.getElementById("movementModal");

const expenseForm = document.getElementById("expenseForm");
const incomeForm = document.getElementById("incomeForm");

const tabButtons = document.querySelectorAll(".tab-button");
const navButtons = document.querySelectorAll(".nav-button");

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

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    changePage(button.dataset.page);
  });
});

clearFiltersButton.addEventListener("click", () => {
  monthFilter.value = currentMonth;
  typeFilter.value = "all";
  categoryFilter.value = "all";
  searchInput.value = "";
  startDateFilter.value = "";
  endDateFilter.value = "";

  renderApp();
  filtersModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
});

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newExpense = {
    id: createId(),
    type: "expense",
    category: document.getElementById("expenseCategory").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    concept: document.getElementById("expenseConcept").value.trim(),
    amount: Number(document.getElementById("expenseAmountInput").value),
    date: document.getElementById("expenseDate").value,
  };

  let updatedMovements;

  if (editingMovementId) {
    updatedMovements = movements.map((movement) => {
      if (movement.id === editingMovementId) {
        return {
          ...newExpense,
          id: editingMovementId,
        };
      }

      return movement;
    });

    setEditingMovementId(null);

    showToast({
      type: "info",
      message: "Movimiento actualizado",
    });
  } else {
    updatedMovements = [...movements, newExpense];

    showToast({
      type: "success",
      message: "Gasto registrado",
    });
  }

  setMovements(updatedMovements);
  saveMovements(updatedMovements);

  resetForms();
  movementModal.classList.add("hidden");
  renderApp();
});

incomeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newIncome = {
    id: createId(),
    type: "income",
    concept: document.getElementById("incomeConcept").value.trim(),
    amount: Number(document.getElementById("incomeAmountInput").value),
    date: document.getElementById("incomeDate").value,
  };

  let updatedMovements;

  if (editingMovementId) {
    updatedMovements = movements.map((movement) => {
      if (movement.id === editingMovementId) {
        return {
          ...newIncome,
          id: editingMovementId,
        };
      }

      return movement;
    });

    setEditingMovementId(null);

    showToast({
      type: "info",
      message: "Movimiento actualizado",
    });
  } else {
    updatedMovements = [...movements, newIncome];

    showToast({
      type: "success",
      message: "Ingreso registrado",
    });
  }

  setMovements(updatedMovements);
  saveMovements(updatedMovements);

  resetForms();
  movementModal.classList.add("hidden");
  renderApp();
});

clearAllButton.addEventListener("click", async () => {
  const confirmed = await showConfirmModal({
    title: "Limpiar movimientos",
    message: "Se eliminarán todos los registros guardados.",
    confirmText: "Eliminar todo",
    cancelText: "Cancelar",
    type: "danger",
  });

  if (!confirmed) return;

  setMovements([]);
  saveMovements([]);
  renderApp();

  showToast({
    type: "success",
    message: "Movimientos eliminados",
  });
});

openFiltersButton.addEventListener("click", () => {
  filtersModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
});

closeFiltersButton.addEventListener("click", () => {
  filtersModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
});

applyFiltersButton.addEventListener("click", () => {
  renderApp();
  filtersModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
});

filtersModal.addEventListener("click", (event) => {
  if (event.target === filtersModal) {
    filtersModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }
});

movementsList.addEventListener("click", handleMovementActions);

openMovementModalButton.addEventListener("click", () => {
  resetForms();
  movementModal.classList.remove("hidden");
});

closeMovementModalButton.addEventListener("click", () => {
  resetForms();
  movementModal.classList.add("hidden");
});

movementModal.addEventListener("click", (event) => {
  if (event.target === movementModal) {
    resetForms();
    movementModal.classList.add("hidden");
  }
});

export function renderApp() {
  renderSummary();
  renderMovements();
  renderStatistics();
  renderMorePage();
  renderHomeHeader();
}



setupWelcomeEvents();
loadAppConfiguration();
setupStatisticsEvents();

renderWelcomeScreen();

changePage("homePage");
renderApp();
showWelcomeIfNeeded();

