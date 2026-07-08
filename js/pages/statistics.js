import { movements } from "../state.js";
import { formatCurrency } from "../utils.js";
import { CATEGORIES } from "../config/categories.js";
import { PAYMENT_METHODS } from "../config/paymentMethods.js";

const statisticsBalance = document.getElementById("statisticsBalance");
const statisticsIncome = document.getElementById("statisticsIncome");
const statisticsExpense = document.getElementById("statisticsExpense");
const statisticsMonth = document.getElementById("statisticsMonth");

const topCategoryName = document.getElementById("topCategoryName");
const topCategoryAmount = document.getElementById("topCategoryAmount");

const topPaymentMethod = document.getElementById("topPaymentMethod");
const topPaymentCount = document.getElementById("topPaymentCount");

const topCategoriesList = document.getElementById("topCategoriesList");

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

let selectedDate = new Date();

export function renderStatistics() {
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  statisticsMonth.textContent = `${monthNames[selectedMonth]} ${selectedYear}`;

  const monthlyMovements = movements.filter((movement) => {
    const movementDate = new Date(movement.date + "T00:00:00");

    return (
      movementDate.getMonth() === selectedMonth &&
      movementDate.getFullYear() === selectedYear
    );
  });

  const totalIncome = monthlyMovements
    .filter((movement) => movement.type === "income")
    .reduce((total, movement) => total + movement.amount, 0);

  const totalExpense = monthlyMovements
    .filter((movement) => movement.type === "expense")
    .reduce((total, movement) => total + movement.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryTotals = {};
  const paymentTotals = {};

    monthlyMovements
    .filter((movement) => movement.type === "expense")
    .forEach((movement) => {

        categoryTotals[movement.category] =
        (categoryTotals[movement.category] || 0) + movement.amount;

        paymentTotals[movement.paymentMethod] =
        (paymentTotals[movement.paymentMethod] || 0) + 1;

    });

    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    topCategoriesList.innerHTML = "";

    if (sortedCategories.length === 0) {
      topCategoriesList.innerHTML = `
        <p class="statistics-empty">No hay gastos registrados este mes.</p>
      `;
    } else {
      sortedCategories.forEach(([categoryName, amount]) => {
        const categoryInfo = getCategoryInfo(categoryName);

        const item = document.createElement("div");
        item.classList.add("statistics-list-item");

        item.innerHTML = `
          <span>
            ${categoryInfo ? `${categoryInfo.icon} ${categoryInfo.name}` : categoryName}
          </span>

          <strong>${formatCurrency(amount)}</strong>
        `;

        topCategoriesList.appendChild(item);
      });
    }

    let topCategory = "-";
    let topCategoryValue = 0;

    Object.entries(categoryTotals).forEach(([category, amount]) => {
    if (amount > topCategoryValue) {
        topCategory = category;
        topCategoryValue = amount;
    }
    });

    let mostUsedPayment = "-";
    let paymentCount = 0;

    Object.entries(paymentTotals).forEach(([method, count]) => {
    if (count > paymentCount) {
        mostUsedPayment = method;
        paymentCount = count;
    }
    });

    const topCategoryInfo = getCategoryInfo(topCategory);

    topCategoryName.textContent =
      topCategoryInfo
        ? `${topCategoryInfo.icon} ${topCategoryInfo.name}`
        : topCategory;


    topCategoryAmount.textContent = formatCurrency(topCategoryValue);

    const topPaymentInfo = getPaymentMethodInfo(mostUsedPayment);

    topPaymentMethod.textContent =
      topPaymentInfo
        ? `${topPaymentInfo.icon} ${topPaymentInfo.name}`
        : mostUsedPayment;


    topPaymentCount.textContent =
    paymentCount === 1
        ? "1 movimiento"
        : `${paymentCount} movimientos`;

  statisticsIncome.textContent = formatCurrency(totalIncome);
  statisticsExpense.textContent = formatCurrency(totalExpense);
  statisticsBalance.textContent = formatCurrency(balance);
}

export function setupStatisticsEvents() {
  const previousMonthButton = document.getElementById("previousMonthButton");
  const nextMonthButton = document.getElementById("nextMonthButton");

  previousMonthButton.addEventListener("click", () => {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    renderStatistics();
  });

  nextMonthButton.addEventListener("click", () => {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    renderStatistics();
  });
}

function getCategoryInfo(categoryName) {
  return CATEGORIES.find((category) => category.name === categoryName);
}

function getPaymentMethodInfo(methodName) {
  return PAYMENT_METHODS.find((method) => method.name === methodName);
}