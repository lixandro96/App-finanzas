import { APP_CONFIG } from "../config/appConfig.js";
import { getUserName } from "./welcome.js";

const homeGreeting = document.getElementById("homeGreeting");
const homeDate = document.getElementById("homeDate");

export function renderHomeHeader() {
  const userName = getUserName();

  const hour = new Date().getHours();

  let greeting;

  if (hour >= 5 && hour < 12) {
    greeting = APP_CONFIG.home.morning;
  } else if (hour >= 12 && hour < 19) {
    greeting = APP_CONFIG.home.afternoon;
  } else {
    greeting = APP_CONFIG.home.evening;
  }

  homeGreeting.textContent = `${greeting}, ${userName} 👋`;

  homeDate.textContent = new Intl.DateTimeFormat(
    APP_CONFIG.locale,
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(new Date());
}