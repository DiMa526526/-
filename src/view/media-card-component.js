import { createElement } from "../framework/render.js";
import { AbstractComponent } from "../framework/view/abstract-component.js";

function createMediaCardTemplate(media) {
  const favoriteClass = media.isFavorite ? "favorited" : "";

  const typeText = media.type === "film" ? "Фильм" : "Сериал";

  const getGenreName = (genre) => {
    const genreMap = {
      "sci-fi": "Фантастика",
      fantasy: "Фэнтези",
      horror: "Ужасы",
      detective: "Детектив",
      mystic: "Мистика",
    };
    return genreMap[genre] || genre;
  };

  return `<article class="media-card" data-type="${media.type}" data-genre="${
    media.genre
  }">
    <img src="${media.image}" alt="Постер ${media.title}" />
    <div class="card-info">
      <div class="card-header">
        <h3 class="card-title">${media.title}</h3>
        <button
          class="card-fav ${favoriteClass}"
          aria-pressed="${media.isFavorite}"
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
        <span class="media-type">${typeText}</span>
        <span class="media-genre">${getGenreName(media.genre)}</span>
      </div>
      <div class="card-actions">
        <button class="card-playlist btn-secondary">
          <img src="../../icons/gear-alt-svgrepo-com.svg" class="icon" alt="" />Управление плейлистами
        </button>
        <button class="delete-btn">
          <img src="./icons/trash.svg" class="icon" alt="" />Удалить
        </button>
      </div>
    </div>
  </article>`;
}

export default class MediaCardComponent extends AbstractComponent {
  constructor(media) {
    super();
    this.media = media;
  }

  get template() {
    return createMediaCardTemplate(this.media);
  }
}
