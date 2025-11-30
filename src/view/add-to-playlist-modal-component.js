import { AbstractComponent } from "../framework/view/abstract-component.js";

function createAddToPlaylistModalTemplate(playlists, mediaTitle) {
  return `
    <div class="overlay">
      <div class="modal">
        <div class="modal-header">
          <div>Добавить в плейлист</div>
          <div class="close">×</div>
        </div>
        <div class="subtitle">Выберите плейлист для "${mediaTitle}"</div>

        <div class="playlist-list">
          ${playlists
            .map(
              (playlist) => `
            <label class="playlist-item">
              <input type="checkbox" value="${
                playlist.id
              }" class="playlist-checkbox" 
                     ${playlist.isDefault ? "disabled" : ""} />
              <span class="playlist-name">${playlist.name}</span>
              ${
                playlist.isDefault
                  ? '<span class="default-badge">системный</span>'
                  : ""
              }
            </label>
          `
            )
            .join("")}
        </div>

        <div class="buttons">
          <button class="btn cancel">Отмена</button>
          <button class="btn create">Добавить</button>
        </div>
      </div>
    </div>
  `;
}

export default class AddToPlaylistModalComponent extends AbstractComponent {
  constructor(playlists, mediaTitle) {
    super();
    this.playlists = playlists;
    this.mediaTitle = mediaTitle;
  }

  get template() {
    return createAddToPlaylistModalTemplate(this.playlists, this.mediaTitle);
  }

  // Метод для получения выбранных плейлистов
  getSelectedPlaylists() {
    const checkboxes = this.element.querySelectorAll(
      ".playlist-checkbox:checked:not(:disabled)"
    );
    return Array.from(checkboxes).map((checkbox) => checkbox.value);
  }

  // Метод для установки обработчика закрытия
  setCloseHandler(handler) {
    const closeBtn = this.element.querySelector(".close");
    const cancelBtn = this.element.querySelector(".cancel");
    const overlay = this.element.querySelector(".overlay");

    if (closeBtn) closeBtn.addEventListener("click", handler);
    if (cancelBtn) cancelBtn.addEventListener("click", handler);
    if (overlay)
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) handler();
      });
  }

  // Метод для установки обработчика добавления
  setAddHandler(handler) {
    const addBtn = this.element.querySelector(".create");

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const selectedPlaylists = this.getSelectedPlaylists();
        handler(selectedPlaylists);
      });
    }
  }
}
