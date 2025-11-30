// main.js (альтернативная версия)
import { render, RenderPosition } from "./framework/render.js";
import MediaPresenter from "./presenter/media-presenter.js";

// Находим существующие контейнеры в HTML
const bodyContainer = document.querySelector(".board-app");
const pageWrapper = document.querySelector(".page-wrapper");
const mainContent = document.querySelector(".main-content");

// Создаем контейнеры внутри существующей структуры
const headerContainer = document.createElement("div");
const navigationContainer = document.createElement("div");
const mediaGridContainer = document.createElement("div");

// Очищаем mainContent и добавляем наш контейнер для сетки
mainContent.innerHTML = "";
mainContent.appendChild(mediaGridContainer);

// Добавляем header перед bodyContainer
bodyContainer.parentNode.insertBefore(headerContainer, bodyContainer);

// Добавляем navigation в pageWrapper (заменяем существующую навигацию)
const existingNavigation = pageWrapper.querySelector(".navigation-section");
if (existingNavigation) {
  existingNavigation.remove();
}
pageWrapper.insertAdjacentElement(
  RenderPosition.AFTERBEGIN,
  navigationContainer
);

// Создаем и инициализируем презентер
const mediaPresenter = new MediaPresenter(
  headerContainer,
  navigationContainer,
  mediaGridContainer
);

mediaPresenter.init();

console.log("MediaPresenter initialized with existing HTML structure!");
