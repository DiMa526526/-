import { render, RenderPosition } from "./framework/render.js";
import MediaApiService from "./media-api-service.js";
import MediaPresenter from "./presenter/media-presenter.js";
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

  const mediaApiService = new MediaApiService(END_POINT);
  const mediaModel = new MediaModel({ mediaApiService });

  await mediaModel.loadData();

  const existingNavigation = pageWrapper.querySelector(".navigation-section");
  if (existingNavigation) {
    existingNavigation.remove();
  }
  pageWrapper.insertAdjacentElement(
    RenderPosition.AFTERBEGIN,
    navigationContainer
  );

  const mediaPresenter = new MediaPresenter(
    headerContainer,
    navigationContainer,
    mediaGridContainer,
    mediaModel
  );

  mediaPresenter.init();
}

initApp().catch(console.error);
