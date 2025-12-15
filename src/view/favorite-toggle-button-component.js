import { AbstractComponent } from "../framework/view/abstract-component.js";

export class FavoriteToggleButtonComponent extends AbstractComponent {
  constructor({ isFavorite, onClick }) {
    super();
    this._isFavorite = isFavorite;
    this._onClick = onClick;
  }

  get template() {
    const favoriteClass = this._isFavorite ? "favorited" : "";
    const ariaPressed = this._isFavorite;

    return `
      <button
        class="card-fav ${favoriteClass}"
        aria-pressed="${ariaPressed}"
        aria-label="${
          this._isFavorite ? "Удалить из избранного" : "Добавить в избранное"
        }"
      >
        <svg
          class="card-star"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 .587l3.668 7.431L23.6 9.75l-5.8 5.656L19.336 23 12 19.188 4.664 23l1.536-7.594L.4 9.75l7.932-1.732L12 .587z"/>
        </svg>
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
