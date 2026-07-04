import { getFilteredMovements } from "./filters.js";
import { formatCurrency } from "./utils.js";

const balanceAmount = document.getElementById("balanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");

export function renderSummary() {
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