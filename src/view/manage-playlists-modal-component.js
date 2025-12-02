import { AbstractComponent } from "../framework/view/abstract-component.js";

function createManagePlaylistsModalTemplate(playlists) {
  return `
    <div class="overlay">
      <div class="modal manage-playlists-modal">
        <div class="modal-header">
          <div class="modal-title">Управление плейлистами</div>
          <button class="close-btn" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#A9A9A9" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-subtitle">Смотри и управляй своими плейлистами</div>
        
        <div class="playlists-list">
          ${playlists
            .map(
              (playlist) => `
            <div class="playlist-item" data-playlist-id="${playlist.id}">
              <div class="playlist-content">
                ${
                  playlist.isDefault
                    ? `
                  <span class="playlist-name">${playlist.name}</span>
                  <span class="default-badge">системный</span>
                `
                    : `
                  <input 
                    type="text" 
                    class="playlist-edit-input" 
                    value="${playlist.name}"
                    maxlength="50"
                  >
                `
                }
              </div>
              
              <div class="playlist-actions">
                ${
                  !playlist.isDefault
                    ? `
                  <button class="btn-edit" title="Сохранить изменения">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <button class="btn-delete" title="Удалить плейлист">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
                      <path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                `
                    : ""
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        
        <div class="modal-notes">
          <p>• Системные плейлисты нельзя редактировать или удалять</p>
          <p>• При удалении плейлиста медиа-элементы остаются в библиотеке</p>
        </div>
      </div>
    </div>
  `;
}

export default class ManagePlaylistsModalComponent extends AbstractComponent {
  constructor(playlists) {
    super();
    this.playlists = playlists;
    this.editMode = new Map();
  }

  get template() {
    return createManagePlaylistsModalTemplate(this.playlists);
  }

  setCloseHandler(handler) {
    const closeBtn = this.element.querySelector(".close-btn");
    const overlay = this.element.querySelector(".overlay");

    if (closeBtn) closeBtn.addEventListener("click", handler);

    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) handler();
      });
    }
  }

  setDeleteHandler(handler) {
    const deleteButtons = this.element.querySelectorAll(".btn-delete");

    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const playlistItem = e.target.closest(".playlist-item");
        const playlistId = playlistItem.dataset.playlistId;

        if (confirm("Вы уверены, что хотите удалить этот плейлист?")) {
          handler(playlistId);
        }
      });
    });
  }

  setEditHandler(handler) {
    const editButtons = this.element.querySelectorAll(".btn-edit");
    const inputs = this.element.querySelectorAll(".playlist-edit-input");

    editButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const playlistItem = e.target.closest(".playlist-item");
        const playlistId = playlistItem.dataset.playlistId;
        const input = playlistItem.querySelector(".playlist-edit-input");

        if (input && input.value.trim()) {
          handler(playlistId, input.value.trim());
        }
      });
    });

    inputs.forEach((input) => {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const playlistItem = e.target.closest(".playlist-item");
          const playlistId = playlistItem.dataset.playlistId;
          const editBtn = playlistItem.querySelector(".btn-edit");

          if (editBtn && input.value.trim()) {
            handler(playlistId, input.value.trim());
          }
        }
      });
    });
  }

  focusInput() {
    const firstInput = this.element.querySelector(".playlist-edit-input");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}
