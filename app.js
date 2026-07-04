const expenseForm = document.getElementById("expenseForm");
const incomeForm = document.getElementById("incomeForm");

const tabButtons = document.querySelectorAll(".tab-button");

const balanceAmount = document.getElementById("balanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");

const movementsList = document.getElementById("movementsList");
const clearAllButton = document.getElementById("clearAllButton");

const monthFilter = document.getElementById("monthFilter");
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");

const openFiltersButton = document.getElementById("openFiltersButton");
const closeFiltersButton = document.getElementById("closeFiltersButton");
const applyFiltersButton = document.getElementById("applyFiltersButton");
const filtersModal = document.getElementById("filtersModal");

let movements = JSON.parse(localStorage.getItem("movements")) || [];
let editingMovementId = null;

const today = new Date().toISOString().split("T")[0];
const currentMonth = today.slice(0, 7);
monthFilter.value = currentMonth;

document.getElementById("expenseDate").value = today;
document.getElementById("incomeDate").value = today;

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTab = button.dataset.tab;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    expenseForm.classList.remove("active");
    incomeForm.classList.remove("active");

    if (selectedTab === "expense") {
      expenseForm.classList.add("active");
    } else {
      incomeForm.classList.add("active");
    }
  });
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

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newExpense = {
    id: crypto.randomUUID(),
    type: "expense",
    category: document.getElementById("expenseCategory").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    concept: document.getElementById("expenseConcept").value,
    amount: Number(document.getElementById("expenseAmountInput").value),
    date: document.getElementById("expenseDate").value,
  };

  if (editingMovementId) {
    movements = movements.map((movement) => {
      if (movement.id === editingMovementId) {
        return {
          ...newExpense,
          id: editingMovementId,
        };
      }

      return movement;
    });

    editingMovementId = null;
    document.querySelector(".expense-button").textContent = "Guardar gasto";
  } else {
  movements.push(newExpense);
}

saveMovements();
renderApp();

expenseForm.reset();
document.getElementById("expenseDate").value = today;
});

incomeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newIncome = {
    id: crypto.randomUUID(),
    type: "income",
    concept: document.getElementById("incomeConcept").value,
    amount: Number(document.getElementById("incomeAmountInput").value),
    date: document.getElementById("incomeDate").value,
  };

  if (editingMovementId) {
    movements = movements.map((movement) => {
      if (movement.id === editingMovementId) {
        return {
          ...newIncome,
          id: editingMovementId,
        };
      }

      return movement;
    });

    editingMovementId = null;
    document.querySelector(".income-button").textContent = "Guardar ingreso";
  } else {
    movements.push(newIncome);
  }

  saveMovements();
  renderApp();

  incomeForm.reset();
  document.getElementById("incomeDate").value = today;
});

clearAllButton.addEventListener("click", () => {
  const confirmDelete = confirm("¿Seguro que quieres eliminar todos los movimientos?");

  if (!confirmDelete) return;

  movements = [];
  saveMovements();
  renderApp();
});


function saveMovements() {
  localStorage.setItem("movements", JSON.stringify(movements));
}

function renderApp() {
  renderSummary();
  renderMovements();
}

function getFilteredMovements() {
  const selectedMonth = monthFilter.value;
  const selectedType = typeFilter.value;
  const searchText = searchInput.value.toLowerCase().trim();

  return movements.filter((movement) => {
    const movementMonth = movement.date.slice(0, 7);

    const matchesMonth = selectedMonth === "" || movementMonth === selectedMonth;
    const matchesType = selectedType === "all" || movement.type === selectedType;
    const matchesSearch = movement.concept.toLowerCase().includes(searchText);

    return matchesMonth && matchesType && matchesSearch;
  });
}

function renderSummary() {
  const filteredMovements = getFilteredMovements();

  const totalIncome = filteredMovements
    .filter((movement) => movement.type === "income")
    .reduce((total, movement) => total + movement.amount, 0);

  const totalExpense = filteredMovements
    .filter((movement) => movement.type === "expense")
    .reduce((total, movement) => total + movement.amount, 0);

  const balance = totalIncome - totalExpense;

  incomeAmount.textContent = formatCurrency(totalIncome);
  expenseAmount.textContent = formatCurrency(totalExpense);
  balanceAmount.textContent = formatCurrency(balance);
}

function renderMovements() {
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
        <button class="edit-button" onclick="editMovement('${movement.id}')">
          Editar
        </button>

        <button class="delete-button" onclick="deleteMovement('${movement.id}')">
          Eliminar
        </button>
      </div>
    `;

    movementsList.appendChild(card);
  });
}

function editMovement(id) {
  const movement = movements.find((item) => item.id === id);

  if (!movement) return;

  editingMovementId = id;

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

  movements = movements.filter((movement) => movement.id !== id);
  saveMovements();
  renderApp();
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(value);
}

function formatDate(date) {
  return new Date(date + "T00:00:00").toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

renderApp();
