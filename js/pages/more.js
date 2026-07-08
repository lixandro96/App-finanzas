import { APP_CONFIG } from "../config/appConfig.js";

const appName = document.getElementById("appName");
const appVersion = document.getElementById("appVersion");
const developerName = document.getElementById("developerName");

export function renderMorePage() {
  appName.textContent = APP_CONFIG.appName;
  appVersion.textContent = APP_CONFIG.version;
  developerName.textContent = APP_CONFIG.developer;
}