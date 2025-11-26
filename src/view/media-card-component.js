import { createElement } from "../framework/render.js";

function createMediaCardTemplate() {
  return `<article class="media-card" data-type="film" data-genre="sci-fi">
              <img
                src="https://avatars.mds.yandex.net/i?id=55234770853d2b9b0d04c21ef80ac927876bea07-5246350-images-thumbs&n=13"
                alt="Постер фильма 'Начало'"
              />
              <div class="card-info">
                <div class="card-header">
                  <h3 class="card-title">Начало</h3>
                  <button
                    class="card-fav favorited"
                    aria-pressed="false"
                    aria-label="Добавить в избранное"
                  >
                    <svg
                      class="card-star"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M12 .587l3.668 7.431L23.6 9.75l-5.8 5.656L19.336 23 12 19.188 4.664 23l1.536-7.594L.4 9.75l7.932-1.732L12 .587z"
                      />
                    </svg>
                  </button>
                </div>
                <div class="card-tags">
                  <span class="media-type">Фильм</span>
                  <span class="media-genre">Фантастика</span>
                </div>
                <button class="delete-btn">
                  <img src="./icons/trash.svg" class="icon" alt="" />Удалить
                </button>
              </div>
            </article>`;
}

export default class MediaCardComponent {
  getTemplate() {
    return createMediaCardTemplate();
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
