import { createElement } from "../framework/render.js";

function createNavigationTemplate() {
  return `<div class="navigation-section">
          <nav class="playlist-nav">
            <button class="tab active" data-tab="all">Вся медиатека</button>
            <button class="tab" data-tab="favorites">
              <svg
                class="tab-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M10.3408 5.03809L10.4531 5.23828L10.6787 5.28418L15.1973 6.18848L12.0732 9.57715L11.918 9.74609L11.9443 9.97363L12.4795 14.5498L8.29297 12.627L8.08398 12.5312L7.875 12.627L3.6875 14.5498L4.22363 9.97363L4.25 9.74609L4.09473 9.57715L0.969727 6.18848L5.48926 5.28418L5.71484 5.23828L5.82715 5.03809L8.08398 1.01953L10.3408 5.03809Z"
                  stroke="black"
                />
              </svg>
              Избранное
            </button>
            <button class="tab" data-tab="playlist1">Плейлист 1</button>
          </nav>

          <div class="control-panel">
            <button class="btn" id="new-playlist-btn">
              <img src="./icons/plus-small.svg" class="btn-icon" alt="" />
              Новый плейлист
            </button>
            <button class="btn" id="manage-btn">
              <img src="./icons/list-pointers.svg" class="btn-icon" alt="" />
              Управление
            </button>
          </div>
        </div>`;
}

export default class NavigationComponent {
  getTemplate() {
    return createNavigationTemplate();
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
