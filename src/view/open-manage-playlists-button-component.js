import { AbstractComponent } from "../framework/view/abstract-component.js";

export class OpenManagePlaylistsButtonComponent extends AbstractComponent {
  constructor({ onClick }) {
    super();
    this._onClick = onClick;
  }

  get template() {
    return `
      <button class="btn" id="manage-btn">
        <img src="/icons/list-pointers.svg" class="btn-icon" alt="" />
        Управление
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
