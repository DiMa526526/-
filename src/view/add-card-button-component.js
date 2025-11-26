import { createElement } from "../framework/render.js";

function createAddCardButtonTemplate() {
  return `<button
          class="add-card-btn"
          id="add-card-btn"
          title="Добавить фильм или сериал"
        >
          +
        </button>`;
}

export default class AddCardButtonComponent {
  getTemplate() {
    return createAddCardButtonTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
