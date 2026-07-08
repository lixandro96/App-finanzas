import { APP_CONFIG } from "./config/appConfig.js";

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-button");


const pageTitles = {
  homePage: "Resumen de tus finanzas",
  movementsPage: "Consulta todos tus movimientos",
  statisticsPage: "Analiza tus finanzas",
  morePage: "Información, herramientas y opciones de la aplicación.",
};

const pageSubtitle = document.getElementById("pageSubtitle");

export function changePage(pageId) {
  pages.forEach((page) => {
    page.classList.remove("active-page");
  });

  navButtons.forEach((button) => {
    button.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active-page");

  document
    .querySelector(`[data-page="${pageId}"]`)
    .classList.add("active");

  pageSubtitle.textContent = pageTitles[pageId];
}