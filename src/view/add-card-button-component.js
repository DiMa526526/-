import { createElement } from "../framework/render.js";
import { AbstractComponent } from "../framework/view/abstract-component.js";

function createAddCardButtonTemplate() {
  return `<button
          class="add-card-btn"
          id="add-card-btn"
          title="Добавить фильм или сериал"
        >
          +
        </button>`;
}

export default class AddCardButtonComponent extends AbstractComponent {
  get template() {
    return createAddCardButtonTemplate();
  }
}
