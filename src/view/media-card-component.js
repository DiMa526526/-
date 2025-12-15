import { AbstractComponent } from "../framework/view/abstract-component.js";
import { FavoriteToggleButtonComponent } from "./favorite-toggle-button-component.js";
import { ManagePlaylistButtonComponent } from "./manage-playlist-button-component.js";
import { DeleteMediaButtonComponent } from "./delete-media-button-component.js";

function createMediaCardTemplate(media) {
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

  return `
    <article class="media-card" data-type="${media.type}" data-genre="${
    media.genre
  }">
      <img src="${media.image}" alt="Постер ${media.title}" />
      <div class="card-info">
        <div class="card-header">
          <h3 class="card-title">${media.title}</h3>

        </div>
        <div class="card-tags">
          <span class="media-type">${typeText}</span>
          <span class="media-genre">${getGenreName(media.genre)}</span>
        </div>
        <div class="card-actions">

        </div>
      </div>
    </article>
  `;
}

export default class MediaCardComponent extends AbstractComponent {
  constructor(media, { onToggleFavorite, onManagePlaylist, onDelete }) {
    super();
    this.media = media;
    this._onToggleFavorite = onToggleFavorite;
    this._onManagePlaylist = onManagePlaylist;
    this._onDelete = onDelete;
  }

  get template() {
    return createMediaCardTemplate(this.media);
  }

  afterRender() {
    const headerContainer = this.element.querySelector(".card-header");
    const actionsContainer = this.element.querySelector(".card-actions");

    try {
      const favoriteBtn = new FavoriteToggleButtonComponent({
        isFavorite: this.media.isFavorite,
        onClick: () => this._onToggleFavorite(this.media.id),
      });
      headerContainer.appendChild(favoriteBtn.element);

      const manageBtn = new ManagePlaylistButtonComponent({
        onClick: () => this._onManagePlaylist(this.media),
      });
      const deleteBtn = new DeleteMediaButtonComponent({
        onClick: () => this._onDelete(this.media.id),
      });

      actionsContainer.appendChild(manageBtn.element);
      actionsContainer.appendChild(deleteBtn.element);
    } catch (error) {
      console.error("Error in afterRender:", error);
    }
  }
}
