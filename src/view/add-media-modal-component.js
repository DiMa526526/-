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
            <input 
              type="text" 
              class="form-input" 
              placeholder="Введите название"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">
              Тип <span class="required">*</span>
            </label>
            <select class="form-select" required>
              <option value="" disabled selected>Выберите тип</option>
              <option value="film">Фильм</option>
              <option value="series">Сериал</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              Жанр <span class="required">*</span>
            </label>
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
            <input 
              type="url" 
              class="form-input" 
              placeholder="Введите ссылку на постер"
            >
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-cancel">Отмена</button>
            <button type="submit" class="btn btn-create">Создать</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export default class AddMediaModalComponent extends AbstractComponent {
  constructor() {
    super();
  }

  get template() {
    return createAddMediaModalTemplate();
  }

  setCloseHandler(handler) {
    const closeBtn = this.element.querySelector(".close-btn");
    const cancelBtn = this.element.querySelector(".btn-cancel");
    const overlay = this.element.querySelector(".overlay");

    [closeBtn, cancelBtn].forEach((btn) => {
      if (btn) btn.addEventListener("click", handler);
    });

    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) handler();
      });
    }
  }

  setSubmitHandler(handler) {
    const form = this.element.querySelector(".media-form");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const mediaData = {
          title:
            formData.get("title") ||
            this.element.querySelector("input[type='text']").value,
          type:
            formData.get("type") || this.element.querySelector("select").value,
          genre:
            formData.get("genre") ||
            this.element.querySelectorAll("select")[1].value,
          image:
            formData.get("image") ||
            this.element.querySelector("input[type='url']").value,
        };

        // Валидация обязательных полей
        if (!mediaData.title || !mediaData.type || !mediaData.genre) {
          alert("Пожалуйста, заполните все обязательные поля");
          return;
        }

        handler(mediaData);
      });
    }
  }

  // Фокусировка на первом поле при открытии
  focusInput() {
    const firstInput = this.element.querySelector("input");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}
