import NavigationComponent from "../view/navigation-component.js";
import MediaGridComponent from "../view/media-grid-component.js";
import MediaCardComponent from "../view/media-card-component.js";
import AddCardButtonComponent from "../view/add-card-button-component.js";
import HeaderComponent from "../view/header-component.js";
import { render } from "../framework/render.js";

export default class UIPresenter {
  constructor(
    mediaModel,
    headerContainer,
    navigationContainer,
    mediaContainer
  ) {
    this.mediaModel = mediaModel;
    this.headerContainer = headerContainer;
    this.navigationContainer = navigationContainer;
    this.mediaContainer = mediaContainer;

    this.state = {
      filters: { type: "all", genre: "all", search: "" },
      activePlaylist: "all",
      activeTab: "all",
    };

    this.components = {
      header: null,
      navigation: null,
      grid: null,
      cards: [],
      addButton: null,
    };

    this.currentModal = null;
  }

  init() {
    this.renderHeader();
  }

  renderHeader() {
    this.headerContainer.innerHTML = "";
    this.components.header = new HeaderComponent();
    render(this.components.header, this.headerContainer);
  }

  bindHeaderEvents(onFilterChange) {
    const el = this.components.header.element;
    el.querySelector("#type-filter")?.addEventListener("change", (e) =>
      onFilterChange({ type: e.target.value })
    );
    el.querySelector("#genre-filter")?.addEventListener("change", (e) =>
      onFilterChange({ genre: e.target.value })
    );
    el.querySelector("#search-input")?.addEventListener("input", (e) =>
      onFilterChange({ search: e.target.value })
    );
  }

  renderNavigation(onTabChange, onNewPlaylist, onManagePlaylists) {
    this.navigationContainer.innerHTML = "";
    const playlists = this.mediaModel.getPlaylists();
    this.components.navigation = new NavigationComponent(playlists, {
      onNewPlaylist,
      onManagePlaylists,
    });
    render(this.components.navigation, this.navigationContainer);
    this.bindTabEvents(onTabChange); // ← ЭТА СТРОКА ОБЯЗАТЕЛЬНА
  }

  bindTabEvents(onTabChange) {
    this.components.navigation.element.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (tab) onTabChange(tab.dataset.tab);
    });
  }

  updateActiveTab(activeTab) {
    if (!this.components.navigation) return;
    this.components.navigation.element
      .querySelectorAll(".tab")
      .forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.tab === activeTab);
      });
  }

  renderMediaGrid(mediaData, onCardActions) {
    this.clearMediaGrid();
    this.mediaContainer.innerHTML = "";

    this.components.grid = new MediaGridComponent();
    render(this.components.grid, this.mediaContainer);

    const gridEl =
      this.components.grid.element.querySelector(".media-grid") ||
      this.components.grid.element;

    mediaData.forEach((media) => {
      const card = new MediaCardComponent(media, {
        onToggleFavorite: () => onCardActions.toggleFavorite(media.id),
        onManagePlaylist: () => onCardActions.managePlaylist(media),
        onDelete: () => onCardActions.delete(media.id),
      });
      render(card, gridEl);
      this.components.cards.push(card);
    });
  }

  renderAddButton(onAddMedia) {
    if (this.components.addButton) {
      this.components.addButton.removeElement?.();
    }
    const parentContainer =
      this.mediaContainer.parentElement || this.mediaContainer;
    this.components.addButton = new AddCardButtonComponent();
    render(this.components.addButton, parentContainer);
    this.components.addButton.element?.addEventListener("click", onAddMedia);
  }

  clearMediaGrid() {
    this.components.cards.forEach((c) => c?.removeElement?.());
    this.components.grid?.removeElement?.();
    this.components.addButton?.removeElement?.();
    this.components.cards = [];
    this.components.grid = null;
    this.components.addButton = null;
  }

  getFilteredMedia(activePlaylist, filters) {
    let media = this.mediaModel.getMediaForPlaylist(activePlaylist);
    return media.filter((item) => {
      const typeMatch = filters.type === "all" || item.type === filters.type;
      const genreMatch =
        filters.genre === "all" || item.genre === filters.genre;
      const searchMatch =
        !filters.search ||
        item.title.toLowerCase().includes(filters.search.toLowerCase());
      return typeMatch && genreMatch && searchMatch;
    });
  }

  open(modalElement) {
    if (this.currentModal) this.close();
    document.body.appendChild(modalElement);
    this.currentModal = modalElement;
  }

  close() {
    if (this.currentModal) {
      this.currentModal.remove();
      this.currentModal = null;
    }
  }

  async showAddMediaModal(onSubmit, onClose) {
    const { default: AddMediaModalComponent } = await import(
      "../view/add-media-modal-component.js"
    );
    const modal = new AddMediaModalComponent();
    const close = () => {
      onClose();
      this.close();
    };
    modal.setCloseHandler(close);
    modal.setSubmitHandler((data) => onSubmit(data, close));
    modal.focusInput();
    this.open(modal.element);
  }

  async showPlaylistModal(onCreate, onClose) {
    const { default: PlaylistModalComponent } = await import(
      "../view/playlist-modal-component.js"
    );
    const modal = new PlaylistModalComponent();
    const close = () => {
      onClose();
      this.close();
    };
    modal.setCloseHandler(close);
    modal.setCreateHandler((name) => onCreate(name, close));
    modal.focusInput();
    this.open(modal.element);
  }

  async showManagePlaylistsModal(playlists, onDelete, onEdit, onClose) {
    const { default: ManagePlaylistsModalComponent } = await import(
      "../view/manage-playlists-modal-component.js"
    );
    const modal = new ManagePlaylistsModalComponent(playlists);
    const close = () => {
      onClose();
      this.close();
    };
    modal.setCloseHandler(close);
    modal.setDeleteHandler((id) => onDelete(id, close));
    modal.setEditHandler((id, name) => onEdit(id, name, close));
    modal.focusInput();
    this.open(modal.element);
  }

  async showManagePlaylistForMedia(playlists, media, onSave, onClose) {
    const { default: ManagePlaylistModalComponent } = await import(
      "../view/add-to-playlist-modal-component.js"
    );
    const modal = new ManagePlaylistModalComponent(
      playlists,
      media.title,
      media.id,
      media.playlistIds || []
    );
    const close = () => {
      onClose();
      this.close();
    };
    modal.setCloseHandler(close);
    modal.setSaveHandler((selectedIds) => onSave(selectedIds, close));
    this.open(modal.element);
  }

  updateState(updates) {
    Object.assign(this.state, updates);
  }

  getState() {
    return { ...this.state };
  }

  destroy() {
    this.components.header?.removeElement?.();
    this.components.navigation?.removeElement?.();
    this.clearMediaGrid();
    this.close();
  }
}
