import { AbstractComponent } from "../framework/view/abstract-component.js";
import { MediaType, Genre } from "../const.js";

function createHeaderComponentTemplate() {
  const typeOptions = Object.entries(MediaType)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");

  const genreOptions = Object.entries(Genre)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");

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
            ${typeOptions}
          </select>

          <select id="genre-filter" class="filter-select">
            <option value="all">Все жанры</option>
            ${genreOptions}
          </select>
        </div>
      </div>
    </header>`;
}

export default class HeaderComponent extends AbstractComponent {
  get template() {
    return createHeaderComponentTemplate();
  }
}
