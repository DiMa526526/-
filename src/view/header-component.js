import { createElement } from "../framework/render.js";

function createHeaderComponentTemplate() {
  return `<header class="header">
      <div class="header-content">
        <div class="header-top">
          <img
            src="./icons/logo.svg"
            alt="Логотип Media Catalog"
            class="logo"
          />
          <h1 class="site-title">Media Catalog</h1>
        </div>

        <div class="search-container">
          <div class="search-bar">
            <input
              type="search"
              id="search-input"
              placeholder="Найти по названию..."
            />
          </div>
        </div>

        <div class="filters">
          <select id="type-filter" class="filter-select">
            <option value="all">Все типы</option>
            <option value="film">Фильмы</option>
            <option value="series">Сериалы</option>
          </select>

          <select id="genre-filter" class="filter-select">
            <option value="all">Все жанры</option>
            <option value="fantasy">Фэнтези</option>
            <option value="sci-fi">Фантастика</option>
            <option value="horror">Ужасы</option>
            <option value="detective">Детектив</option>
            <option value="mystic">Мистика</option>
          </select>
        </div>
      </div>
    </header>`;
}

export default class HeaderComponent {
  getTemplate() {
    return createHeaderComponentTemplate();
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
