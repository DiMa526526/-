import { createElement } from "../framework/render.js";

function createMediaGridTemplate() {
  return `<section class="media-grid">
            
          </section>`;
}

export default class MediaGridComponent {
  getTemplate() {
    return createMediaGridTemplate();
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
