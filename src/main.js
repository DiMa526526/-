import { render, RenderPosition } from "./framework/render.js";
import HeaderComponent from "./view/header-component.js";
import NavigationComponent from "./view/navigation-component.js";
import MediaGridComponent from "./view/media-grid-component.js";
import MediaCardComponent from "./view/media-card-component.js";
import AddCardButtonComponent from "./view/add-card-button-component.js";

const bodyContainer = document.querySelector(".board-app");
const pageWrapper = document.querySelector(".page-wrapper");
const mainContent = document.querySelector(".main-content");

render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new NavigationComponent(), pageWrapper, RenderPosition.AFTERBEGIN);

const mediaGrid = new MediaGridComponent();
render(mediaGrid, mainContent, RenderPosition.AFTERBEGIN);

const gridContainer = mediaGrid.getElement();
render(new MediaCardComponent(), gridContainer);

render(new AddCardButtonComponent(), pageWrapper);
