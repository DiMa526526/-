import NavigationComponent from "../view/navigation-component.js";
import { render } from "../framework/render.js";

export default class NavigationPresenter {
  constructor(
    container,
    mediaModel,
    onTabChange,
    onNewPlaylist,
    onManagePlaylists
  ) {
    this.container = container;
    this.mediaModel = mediaModel;
    this.onTabChange = onTabChange;
    this.onNewPlaylist = onNewPlaylist;
    this.onManagePlaylists = onManagePlaylists;
    this.component = null;
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = "";

    const playlists = this.mediaModel.getPlaylists();
    this.component = new NavigationComponent(playlists, {
      onNewPlaylist: this.onNewPlaylist,
      onManagePlaylists: this.onManagePlaylists,
    });

    render(this.component, this.container);
    this.bindTabEvents();
  }

  bindTabEvents() {
    this.component.element.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (tab) this.onTabChange(tab.dataset.tab);
    });
  }

  updateActiveTab(activeTab) {
    if (!this.component) return;
    this.component.element.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === activeTab);
    });
  }
}
