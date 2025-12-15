import MediaGridComponent from "../view/media-grid-component.js";
import MediaCardComponent from "../view/media-card-component.js";
import AddCardButtonComponent from "../view/add-card-button-component.js";
import { render } from "../framework/render.js";

export default class MediaGridPresenter {
  constructor(container, mediaModel, onAddMedia, onCardAction) {
    this.container = container;
    this.mediaModel = mediaModel;
    this.onAddMedia = onAddMedia;
    this.onCardAction = onCardAction;
    this.components = {
      grid: null,
      cards: [],
      addButton: null,
    };
  }

  render(mediaData) {
    this.clear();

    this.container.innerHTML = "";

    this.components.grid = new MediaGridComponent();
    render(this.components.grid, this.container);

    const gridEl =
      this.components.grid.element.querySelector(".media-grid") ||
      this.components.grid.element;

    mediaData.forEach((media) => {
      const card = new MediaCardComponent(media, {
        onToggleFavorite: (id) => this.onCardAction.toggleFavorite(id),
        onManagePlaylist: (item) => this.onCardAction.managePlaylist(item),
        onDelete: (id) => this.onCardAction.delete(id),
      });
      render(card, gridEl);
      this.components.cards.push(card);
    });

    const parentContainer = this.container.parentElement || this.container;
    this.components.addButton = new AddCardButtonComponent();
    render(this.components.addButton, parentContainer);

    this.components.addButton.element?.addEventListener("click", () =>
      this.onAddMedia()
    );
  }

  clear() {
    this.components.cards.forEach((c) => c?.removeElement?.());
    this.components.grid?.removeElement?.();
    this.components.addButton?.removeElement?.();
    this.components = { grid: null, cards: [], addButton: null };
  }
}
