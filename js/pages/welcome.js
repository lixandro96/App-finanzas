import { showToast } from "../components/toast.js";
import { APP_CONFIG } from "../config/appConfig.js";

const USER_NAME_KEY = "userName";

const welcomeScreen = document.getElementById("welcomeScreen");
const welcomeForm = document.getElementById("welcomeForm");
const userNameInput = document.getElementById("userNameInput");
const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeDescription = document.getElementById("welcomeDescription");

export function getUserName() {
  return localStorage.getItem(USER_NAME_KEY) || "";
}

export function showWelcomeIfNeeded() {
  const userName = getUserName();

  if (!userName) {
    welcomeScreen.classList.remove("hidden");
  }
}

export function setupWelcomeEvents() {
  welcomeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const userName = userNameInput.value.trim();

    if (!userName) return;

    localStorage.setItem(USER_NAME_KEY, userName);

    welcomeScreen.classList.add("hidden");

    showToast({
      type: "success",
      message: `Bienvenido, ${userName}`,
    });
  });
}

export function clearUserName() {
  localStorage.removeItem(USER_NAME_KEY);
}
export function renderWelcomeScreen() {
  welcomeTitle.textContent =
    `${APP_CONFIG.welcome.title} ${APP_CONFIG.appName}`;

  welcomeDescription.textContent =
    APP_CONFIG.welcome.description;
}