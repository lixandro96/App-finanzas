const expenseForm = document.getElementById("expenseForm");
const incomeForm = document.getElementById("incomeForm");

const tabButtons = document.querySelectorAll(".tab-button");

const balanceAmount = document.getElementById("balanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");

const movementsList = document.getElementById("movementsList");
const clearAllButton = document.getElementById("clearAllButton");

let movements = JSON.parse(localStorage.getItem("movements")) || [];

const today = new Date().toISOString().split("T")[0];

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

  movements.push(newExpense);
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

  movements.push(newIncome);
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

function renderSummary() {
  const totalIncome = movements
    .filter((movement) => movement.type === "income")
    .reduce((total, movement) => total + movement.amount, 0);

  const totalExpense = movements
    .filter((movement) => movement.type === "expense")
    .reduce((total, movement) => total + movement.amount, 0);

  const balance = totalIncome - totalExpense;

  incomeAmount.textContent = formatCurrency(totalIncome);
  expenseAmount.textContent = formatCurrency(totalExpense);
  balanceAmount.textContent = formatCurrency(balance);
}

function renderMovements() {
  movementsList.innerHTML = "";

  if (movements.length === 0) {
    movementsList.innerHTML = `
      <p class="empty-message">No hay movimientos registrados.</p>
    `;
    return;
  }

  const sortedMovements = [...movements].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  sortedMovements.forEach((movement) => {
    const card = document.createElement("div");
    card.classList.add("movement-card", movement.type);

    const sign = movement.type === "income" ? "+" : "-";
    const typeLabel = movement.type === "income" ? "Ingreso" : "Gasto";

    card.innerHTML = `
      <div class="movement-top">
        <div>
          <p class="movement-title">${movement.concept}</p>
          <p class="movement-details">${typeLabel} · ${formatDate(movement.date)}</p>
        </div>

        <strong class="movement-amount ${movement.type}">
          ${sign}${formatCurrency(movement.amount)}
        </strong>
      </div>

      <div class="movement-details">
        ${
          movement.type === "expense"
            ? `
              <p>Categoría: ${movement.category}</p>
              <p>Método: ${movement.paymentMethod}</p>
            `
            : ""
        }
      </div>

      <button class="delete-button" onclick="deleteMovement('${movement.id}')">
        Eliminar
      </button>
    `;

    movementsList.appendChild(card);
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
