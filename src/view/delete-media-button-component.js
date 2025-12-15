import { AbstractComponent } from "../framework/view/abstract-component.js";

export class DeleteMediaButtonComponent extends AbstractComponent {
  constructor({ onClick }) {
    super();
    this._onClick = onClick;
  }

  get template() {
    return `
      <button class="delete-btn">
        <img src="./icons/trash.svg" class="icon" alt="" />
        Удалить
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
