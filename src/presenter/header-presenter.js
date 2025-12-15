import HeaderComponent from "../view/header-component.js";
import { render } from "../framework/render.js";

export default class HeaderPresenter {
  constructor(container, onFilterChange) {
    this.container = container;
    this.onFilterChange = onFilterChange;
    this.component = null;
  }

  init() {
    this.component = new HeaderComponent();
    render(this.component, this.container);
    this.bindEvents();
  }

  bindEvents() {
    const el = this.component.element;
    el.querySelector("#type-filter")?.addEventListener("change", (e) =>
      this.onFilterChange({ type: e.target.value })
    );
    el.querySelector("#genre-filter")?.addEventListener("change", (e) =>
      this.onFilterChange({ genre: e.target.value })
    );
    el.querySelector("#search-input")?.addEventListener("input", (e) =>
      this.onFilterChange({ search: e.target.value })
    );
  }

  destroy() {
    if (this.component?.removeElement) this.component.removeElement();
  }
}
