import { AbstractComponent } from "../framework/view/abstract-component.js";

function createAddMediaModalTemplate() {
  return `
    <div class="overlay">
      <div class="modal add-media-modal">
        <div class="modal-header">
          <div class="modal-title">Добавить новое произведение</div>
          <button class="close-btn" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#A9A9A9" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-subtitle">Добавь новый фильм или сериал</div>
        
        <form class="media-form">
          <div class="form-group">
            <label class="form-label">
              Название <span class="required">*</span>
            </label>
            <input type="text" class="form-input" placeholder="Введите название" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Тип <span class="required">*</span></label>
            <select class="form-select" required>
              <option value="" disabled selected>Выберите тип</option>
              <option value="film">Фильм</option>
              <option value="series">Сериал</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Жанр <span class="required">*</span></label>
            <select class="form-select" required>
              <option value="" disabled selected>Выберите жанр</option>
              <option value="sci-fi">Фантастика</option>
              <option value="fantasy">Фэнтези</option>
              <option value="horror">Ужасы</option>
              <option value="detective">Детектив</option>
              <option value="mystic">Мистика</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Постер</label>
            <input type="url" class="form-input" placeholder="Введите ссылку на постер">
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn cancel">Отмена</button>
            <button type="submit" class="btn create">Создать</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export default class AddMediaModalComponent extends AbstractComponent {
  constructor() {
    super();
    this._closeHandlers = [];
  }

  get template() {
    return createAddMediaModalTemplate();
  }

  setCloseHandler(handler) {
    this._closeHandler = handler;
    this.bindCloseEvents();
  }

  setSubmitHandler(handler) {
    const form = this.element.querySelector(".media-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = this.element
          .querySelector("input[type='text']")
          .value.trim();
        const type = this.element.querySelector("select").value;
        const genre = this.element.querySelectorAll("select")[1].value;
        const image =
          this.element.querySelector("input[type='url']")?.value || "";

        if (!title || !type || !genre) {
          alert("Пожалуйста, заполните все обязательные поля");
          return;
        }

        handler({ title, type, genre, image });
      });
    }
  }

  bindCloseEvents() {
    this._clearCloseHandlers();

    const closeBtn = this.element.querySelector(".close-btn");
    const cancelBtn = this.element.querySelector(".cancel");
    const overlay = this.element.querySelector(".overlay");

    const close = () => {
      if (this._closeHandler) this._closeHandler();
    };

    if (closeBtn) {
      closeBtn.addEventListener("click", close);
      this._closeHandlers.push({
        el: closeBtn,
        event: "click",
        handler: close,
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", close);
      this._closeHandlers.push({
        el: cancelBtn,
        event: "click",
        handler: close,
      });
    }

    if (overlay) {
      const overlayClick = (e) => {
        if (e.target === overlay) close();
      };
      overlay.addEventListener("click", overlayClick);
      this._closeHandlers.push({
        el: overlay,
        event: "click",
        handler: overlayClick,
      });
    }

    const escHandler = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", escHandler);
    this._closeHandlers.push({
      el: document,
      event: "keydown",
      handler: escHandler,
    });
  }

  _clearCloseHandlers() {
    this._closeHandlers.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    this._closeHandlers = [];
  }

  focusInput() {
    const firstInput = this.element.querySelector("input");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  removeElement() {
    this._clearCloseHandlers();
    super.removeElement();
  }
}
