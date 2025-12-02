import { AbstractComponent } from "../framework/view/abstract-component.js";

function createManagePlaylistModalTemplate(
  playlists,
  mediaTitle,
  mediaId,
  currentPlaylistIds = []
) {
  return `
    <div class="overlay">
      <div class="modal">
        <div class="modal-header">
          <div>Управление плейлистами</div>
          <div class="close">×</div>
        </div>
        <div class="subtitle">${mediaTitle}</div>

        <div class="playlist-list">
          ${playlists
            .filter((playlist) => !playlist.isDefault)
            .map(
              (playlist) => `
            <label class="playlist-item">
              <input type="checkbox" value="${playlist.id}" 
                     class="playlist-checkbox" 
                     ${
                       currentPlaylistIds.includes(playlist.id) ? "checked" : ""
                     } />
              <span class="playlist-name">${playlist.name}</span>
            </label>
          `
            )
            .join("")}
        </div>

        <div class="buttons">
          <button class="btn cancel">Отмена</button>
          <button class="btn save">Сохранить</button>
        </div>
      </div>
    </div>
  `;
}

export default class ManagePlaylistModalComponent extends AbstractComponent {
  constructor(playlists, mediaTitle, mediaId, currentPlaylistIds = []) {
    super();
    this.playlists = playlists;
    this.mediaTitle = mediaTitle;
    this.mediaId = mediaId;
    this.currentPlaylistIds = currentPlaylistIds;
  }

  get template() {
    return createManagePlaylistModalTemplate(
      this.playlists,
      this.mediaTitle,
      this.mediaId,
      this.currentPlaylistIds
    );
  }

  getSelectedPlaylists() {
    const checkboxes = this.element.querySelectorAll(
      ".playlist-checkbox:checked"
    );
    return Array.from(checkboxes).map((checkbox) => checkbox.value);
  }

  setCloseHandler(handler) {
    const closeBtn = this.element.querySelector(".close");
    const cancelBtn = this.element.querySelector(".cancel");
    const overlay = this.element.querySelector(".overlay");

    if (closeBtn) closeBtn.addEventListener("click", handler);
    if (cancelBtn) cancelBtn.addEventListener("click", handler);
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) handler();
      });
    }
  }

  setSaveHandler(handler) {
    const saveBtn = this.element.querySelector(".save");

    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const selectedPlaylists = this.getSelectedPlaylists();
        handler(selectedPlaylists);
      });
    }
  }
}
