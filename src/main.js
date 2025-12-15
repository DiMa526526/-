import { RenderPosition } from "./framework/render.js";
import MediaApiService from "./media-api-service.js";
import MediaAppPresenter from "./presenter/media-app-presenter.js";
import MediaModel from "./model/media-model.js";

const END_POINT = "https://69045a5d6b8dabde4963528d.mockapi.io";

async function initApp() {
  const bodyContainer = document.querySelector(".board-app");
  const pageWrapper = document.querySelector(".page-wrapper");
  const mainContent = document.querySelector(".main-content");

  const headerContainer = document.createElement("div");
  const navigationContainer = document.createElement("div");
  const mediaGridContainer = document.createElement("div");

  mainContent.innerHTML = "";
  mainContent.appendChild(mediaGridContainer);
  bodyContainer.parentNode.insertBefore(headerContainer, bodyContainer);

  const existingNav = pageWrapper.querySelector(".navigation-section");
  if (existingNav) existingNav.remove();
  pageWrapper.insertAdjacentElement(
    RenderPosition.AFTERBEGIN,
    navigationContainer
  );

  const mediaApiService = new MediaApiService(END_POINT);
  const mediaModel = new MediaModel({ mediaApiService });
  await mediaModel.loadData();

  const presenter = new MediaAppPresenter(
    headerContainer,
    navigationContainer,
    mediaGridContainer,
    mediaModel
  );
  presenter.init();
}

initApp().catch(console.error);
