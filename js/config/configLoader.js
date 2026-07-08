import { CATEGORIES } from "./categories.js";
import { PAYMENT_METHODS } from "./paymentMethods.js";
import { APP_CONFIG } from "./appConfig.js";

const expenseCategorySelect = document.getElementById("expenseCategory");
const paymentMethodSelect = document.getElementById("paymentMethod");
const categoryFilter = document.getElementById("categoryFilter");
const appHeaderTitle = document.getElementById("appHeaderTitle");

export function loadAppConfiguration() {

  if (appHeaderTitle) {
    appHeaderTitle.textContent = APP_CONFIG.appName;
  }
  document.title = APP_CONFIG.appName;
  loadCategories();
  loadPaymentMethods();
}

function loadCategories() {
  expenseCategorySelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Seleccionar categoría";
  expenseCategorySelect.appendChild(defaultOption);

  CATEGORIES.forEach((category) => {
    const option = document.createElement("option");

    option.value = category.name;
    option.textContent = `${category.icon} ${category.name}`;

    expenseCategorySelect.appendChild(option);
  });
  if (categoryFilter) {
  categoryFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Todas las categorías";
  categoryFilter.appendChild(allOption);

  CATEGORIES.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = `${category.icon} ${category.name}`;
    categoryFilter.appendChild(option);
  });
}
}

function loadPaymentMethods() {
  paymentMethodSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Seleccionar método";
  paymentMethodSelect.appendChild(defaultOption);

  PAYMENT_METHODS.forEach((method) => {
    const option = document.createElement("option");

    option.value = method.name;
    option.textContent = `${method.icon} ${method.name}`;

    paymentMethodSelect.appendChild(option);
  });
}