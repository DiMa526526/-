import { createElement } from "../framework/render.js";
import { AbstractComponent } from "../framework/view/abstract-component.js";

function createMediaGridTemplate() {
  return `<section class="media-grid">
            
          </section>`;
}

export default class MediaGridComponent extends AbstractComponent {
  get template() {
    return createMediaGridTemplate();
  }
}
