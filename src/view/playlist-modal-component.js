import { AbstractComponent } from "../framework/view/abstract-component.js";

function createPlaylistModalTemplate() {
  return `
    <div class="overlay">
      <div class="modal">
        <div class="modal-header">
          <div>Создать Плейлист</div>
          <div class="close">×</div>
        </div>
        <div class="subtitle">Создавай свой плейлист</div>

        <label>
          Название Плейлиста*
          <input type="text" placeholder="Мой плейлист" class="playlist-name-input" />
        </label>

        <div class="buttons">
          <button class="btn cancel" type="button">Отмена</button>
          <button class="btn create" type="button">Создать</button>
        </div>
      </div>
    </div>
  `;
}

export default class PlaylistModalComponent extends AbstractComponent {
  constructor() {
    super();
    this.closeHandler = null;
    this.createHandler = null;
  }

  get template() {
    return createPlaylistModalTemplate();
  }

  setCloseHandler(handler) {
    this.closeHandler = handler;
    this.bindCloseEvents();
  }

  setCreateHandler(handler) {
    this.createHandler = handler;
    this.bindCreateEvents();
  }

  bindCloseEvents() {
    if (!this.closeHandler) return;

    const closeBtn = this.element.querySelector(".close");
    const cancelBtn = this.element.querySelector(".cancel");
    const overlay = this.element;

    if (this._closeHandlers) {
      this._closeHandlers.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    }

    this._closeHandlers = [];

    if (closeBtn) {
      const handler = () => {
        this.closeHandler();
      };
      closeBtn.addEventListener("click", handler);
      this._closeHandlers.push({ element: closeBtn, event: "click", handler });
    }

    if (cancelBtn) {
      const handler = () => {
        this.closeHandler();
      };
      cancelBtn.addEventListener("click", handler);
      this._closeHandlers.push({ element: cancelBtn, event: "click", handler });
    }

    if (overlay) {
      const handler = (e) => {
        if (e.target === overlay) {
          this.closeHandler();
        }
      };
      overlay.addEventListener("click", handler);
      this._closeHandlers.push({ element: overlay, event: "click", handler });
    }

    const escHandler = (e) => {
      if (e.key === "Escape") {
        this.closeHandler();
      }
    };
    document.addEventListener("keydown", escHandler);
    this._closeHandlers.push({
      element: document,
      event: "keydown",
      handler: escHandler,
    });
  }

  bindCreateEvents() {
    if (!this.createHandler) return;

    const createBtn = this.element.querySelector(".create");
    const input = this.element.querySelector(".playlist-name-input");

    if (createBtn) {
      createBtn.addEventListener("click", () => {
        const playlistName = input.value.trim();
        if (playlistName) {
          this.createHandler(playlistName);
        } else {
          input.focus();
        }
      });
    }

    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const playlistName = input.value.trim();
          if (playlistName) {
            this.createHandler(playlistName);
          }
        }
      });
    }
  }

  focusInput() {
    const input = this.element.querySelector(".playlist-name-input");
    if (input) {
      input.focus();
      input.select();
    }
  }

  removeElement() {
    if (this._closeHandlers) {
      this._closeHandlers.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      this._closeHandlers = null;
    }

    super.removeElement();
  }
}
