import { AbstractComponent } from "../framework/view/abstract-component.js";

export class NewPlaylistButtonComponent extends AbstractComponent {
  constructor({ onClick }) {
    super();
    this._onClick = onClick;
  }

  get template() {
    return `
      <button class="btn" id="new-playlist-btn">
        <img src="/icons/plus-small.svg" class="btn-icon" alt="" />
        Новый плейлист
      </button>
    `;
  }

  afterRender() {
    this.element.addEventListener("click", (evt) => {
      evt.stopPropagation();
      this._onClick();
    });
  }
}