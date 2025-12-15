import { AbstractComponent } from "../framework/view/abstract-component.js";

export class ManagePlaylistButtonComponent extends AbstractComponent {
  constructor({ onClick }) {
    super();
    this._onClick = onClick;
  }

  get template() {
    return `
      <button class="card-playlist btn-secondary">
        <img src="./icons/gear-alt-svgrepo-com.svg" class="icon" alt="" />
        Управление плейлистами
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
