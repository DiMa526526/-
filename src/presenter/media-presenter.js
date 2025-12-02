import HeaderComponent from "../view/header-component.js";
import NavigationComponent from "../view/navigation-component.js";
import MediaGridComponent from "../view/media-grid-component.js";
import MediaCardComponent from "../view/media-card-component.js";
import AddCardButtonComponent from "../view/add-card-button-component.js";
import PlaylistModalComponent from "../view/playlist-modal-component.js";
import { render } from "../framework/render.js";

export default class MediaPresenter {
  constructor(
    headerContainer,
    navigationContainer,
    mediaContainer,
    mediaModel
  ) {
    this.headerContainer = headerContainer;
    this.navigationContainer = navigationContainer;
    this.mediaContainer = mediaContainer;
    this.modal = null;
    this.addMediaModal = null;
    this.mediaModel = mediaModel;

    this.currentState = {
      filters: {
        type: "all",
        genre: "all",
        search: "",
      },
      activePlaylist: "all",
      activeTab: "all",
    };

    this.components = {
      header: null,
      navigation: null,
      mediaGrid: null,
      mediaCards: [],
      addButton: null,
    };
  }

  init() {
    this.renderHeader();
    this.renderNavigation();
    this.renderMediaGrid();
    this.bindGlobalEvents();
  }

  renderHeader() {
    this.components.header = new HeaderComponent();
    render(this.components.header, this.headerContainer);
    this.bindHeaderEvents();
  }

  renderNavigation() {
    const playlists = this.mediaModel.getPlaylists();
    this.clearNavigation();

    this.components.navigation = new NavigationComponent(playlists);
    render(this.components.navigation, this.navigationContainer);
    this.bindNavigationEvents();
  }

  clearNavigation() {
    this.navigationContainer.innerHTML = "";

    if (
      this.components.navigation &&
      this.components.navigation.removeElement
    ) {
      this.components.navigation.removeElement();
    }
    this.components.navigation = null;
  }

  renderMediaGrid() {
    this.clearMediaGrid();

    const mediaData = this.getFilteredMedia();

    this.renderMediaCards(mediaData);

    this.renderAddButton();
  }

  renderMediaCards(mediaData) {
    this.components.mediaCards = [];
    this.mediaContainer.innerHTML = "";

    this.components.mediaGrid = new MediaGridComponent();
    render(this.components.mediaGrid, this.mediaContainer);

    const gridElement =
      this.components.mediaGrid.element.querySelector(".media-grid") ||
      this.components.mediaGrid.element;

    mediaData.forEach((media) => {
      const mediaCard = new MediaCardComponent(media);
      render(mediaCard, gridElement);
      this.components.mediaCards.push(mediaCard);
      this.bindMediaCardEvents(mediaCard, media);
    });

    this.renderAddButton();
  }

  renderAddButton() {
    this.components.addButton = new AddCardButtonComponent();
    const parentContainer =
      this.mediaContainer.parentElement || this.mediaContainer;
    render(this.components.addButton, parentContainer);
    this.bindAddButtonEvents();
  }

  clearMediaGrid() {
    this.components.mediaCards.forEach((card) => {
      if (card.removeElement) {
        card.removeElement();
      }
    });
    this.components.mediaCards = [];

    if (this.components.mediaGrid && this.components.mediaGrid.removeElement) {
      this.components.mediaGrid.removeElement();
    }

    if (this.components.addButton && this.components.addButton.removeElement) {
      this.components.addButton.removeElement();
    }
  }

  getFilteredMedia() {
    const { filters, activePlaylist } = this.currentState;

    let media = this.mediaModel.getMediaForPlaylist(activePlaylist);

    media = media.filter((item) => {
      const typeMatch = filters.type === "all" || item.type === filters.type;
      const genreMatch =
        filters.genre === "all" || item.genre === filters.genre;
      const searchMatch =
        !filters.search ||
        item.title.toLowerCase().includes(filters.search.toLowerCase());

      return typeMatch && genreMatch && searchMatch;
    });

    return media;
  }

  bindHeaderEvents() {
    const headerElement = this.components.header.element;

    const typeFilter = headerElement.querySelector("#type-filter");
    if (typeFilter) {
      typeFilter.addEventListener("change", (e) => {
        this.currentState.filters.type = e.target.value;
        this.renderMediaGrid();
      });
    }

    const genreFilter = headerElement.querySelector("#genre-filter");
    if (genreFilter) {
      genreFilter.addEventListener("change", (e) => {
        this.currentState.filters.genre = e.target.value;
        this.renderMediaGrid();
      });
    }

    const searchInput = headerElement.querySelector("#search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.currentState.filters.search = e.target.value;
        this.renderMediaGrid();
      });
    }
  }

  bindNavigationEvents() {
    const navElement = this.components.navigation.element;

    navElement.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (tab) {
        const playlistId = tab.dataset.tab;
        this.handleTabChange(playlistId, tab);
      }
    });

    const newPlaylistBtn = navElement.querySelector("#new-playlist-btn");
    if (newPlaylistBtn) {
      newPlaylistBtn.addEventListener("click", () => {
        this.handleCreatePlaylist();
      });
    }

    const manageBtn = navElement.querySelector("#manage-btn");
    if (manageBtn) {
      manageBtn.addEventListener("click", () => {
        this.handleManagePlaylists();
      });
    }
  }

  bindMediaCardEvents(mediaCard, media) {
    const cardElement = mediaCard.element;

    const favoriteBtn = cardElement.querySelector(".card-fav");
    if (favoriteBtn) {
      favoriteBtn.addEventListener("click", () => {
        this.handleToggleFavorite(media.id);
      });
    }

    const playlistBtn = cardElement.querySelector(".card-playlist");
    if (playlistBtn) {
      playlistBtn.addEventListener("click", () => {
        const playlists = this.mediaModel.getPlaylists();
        this.showManagePlaylistForMedia(playlists, media);
      });
    }

    const deleteBtn = cardElement.querySelector(".delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        this.handleDeleteMedia(media.id);
      });
    }
  }

  async syncMediaWithPlaylists(mediaId, selectedPlaylistIds) {
    try {
      const media = this.mediaModel.getMediaById(mediaId);
      if (!media) {
        throw new Error(`Медиа с ID ${mediaId} не найдено`);
      }

      const currentPlaylistIds = media.playlistIds || [];

      const playlistsToAdd = selectedPlaylistIds.filter(
        (id) => !currentPlaylistIds.includes(id)
      );

      const playlistsToRemove = currentPlaylistIds.filter(
        (id) => !selectedPlaylistIds.includes(id)
      );

      for (const playlistId of playlistsToAdd) {
        await this.mediaModel.addToPlaylist(mediaId, playlistId);
      }

      for (const playlistId of playlistsToRemove) {
        await this.mediaModel.removeFromPlaylist(mediaId, playlistId);
      }

      this.closeManagePlaylistForMediaModal();
      this.renderNavigation();
      this.renderMediaGrid();

      const addedCount = playlistsToAdd.length;
      const removedCount = playlistsToRemove.length;

      if (addedCount > 0 || removedCount > 0) {
        const mediaTitle = this.getMediaTitle(mediaId);
        let message = `Плейлисты обновлены для "${mediaTitle}":`;
        if (addedCount > 0)
          message += `\n✓ Добавлено в ${addedCount} плейлист(ов)`;
        if (removedCount > 0)
          message += `\n✗ Удалено из ${removedCount} плейлист(ов)`;
        alert(message);
      }
    } catch (error) {
      console.error("Error syncing media with playlists:", error);
      alert("Не удалось обновить плейлисты: " + error.message);
      this.closeManagePlaylistForMediaModal();
    }
  }

  handleManagePlaylistForMedia(media) {
    const playlists = this.mediaModel.getPlaylists();
    const currentPlaylistIds = media.playlistIds || [];
    this.showManagePlaylistForMediaModal(playlists, media, currentPlaylistIds);
  }

  bindAddButtonEvents() {
    const addButton = this.components.addButton.element;
    if (addButton) {
      addButton.addEventListener("click", () => {
        this.handleAddMedia();
      });
    }
  }

  bindGlobalEvents() {}

  handleTabChange(playlistId, clickedTab) {
    this.currentState.activePlaylist = playlistId;
    this.currentState.activeTab = playlistId;

    const allTabs = this.components.navigation.element.querySelectorAll(".tab");
    allTabs.forEach((tab) => tab.classList.remove("active"));
    clickedTab.classList.add("active");

    this.renderMediaGrid();
  }

  async handleToggleFavorite(mediaId) {
    try {
      await this.mediaModel.toggleFavorite(mediaId);
      this.renderMediaGrid();
    } catch (error) {
      alert("Не удалось изменить статус избранного");
      console.error("Error toggling favorite:", error);
    }
  }

  async handleDeleteMedia(mediaId) {
    if (confirm("Вы уверены, что хотите удалить этот элемент?")) {
      try {
        await this.mediaModel.deleteMedia(mediaId);
        this.renderMediaGrid();
      } catch (error) {
        alert("Не удалось удалить элемент");
        console.error("Error deleting media:", error);
      }
    }
  }

  handleAddMedia() {
    this.showAddMediaModal();
  }

  showAddMediaModal() {
    import("../view/add-media-modal-component.js").then((module) => {
      const AddMediaModalComponent = module.default;

      this.addMediaModal = new AddMediaModalComponent();
      document.body.appendChild(this.addMediaModal.element);

      this.addMediaModal.setCloseHandler(() => {
        this.closeAddMediaModal();
      });

      this.addMediaModal.setSubmitHandler((mediaData) => {
        this.handleCreateMedia(mediaData);
      });

      this.addMediaModal.focusInput();
    });
  }

  closeAddMediaModal() {
    if (this.addMediaModal && this.addMediaModal.element) {
      if (this.addMediaModal.element.parentNode) {
        this.addMediaModal.element.parentNode.removeChild(
          this.addMediaModal.element
        );
      }
      this.addMediaModal = null;
    }
  }

  async handleCreateMedia(mediaData) {
    try {
      const newMedia = {
        title: mediaData.title,
        type: mediaData.type,
        genre: mediaData.genre,
        image:
          mediaData.image ||
          "https://via.placeholder.com/300x450?text=No+Image",
      };

      await this.mediaModel.addMedia(newMedia);
      this.closeAddMediaModal();
      this.renderMediaGrid();
    } catch (error) {
      alert("Не удалось создать элемент");
      console.error("Error creating media:", error);
    }
  }

  async syncMediaWithPlaylists(mediaId, selectedPlaylistIds) {
    try {
      const media = this.mediaModel.getMediaById(mediaId);
      if (!media) {
        throw new Error(`Медиа с ID ${mediaId} не найдено`);
      }

      const currentPlaylistIds = media.playlistIds || [];

      const playlistsToAdd = selectedPlaylistIds.filter(
        (id) => !currentPlaylistIds.includes(id)
      );

      const playlistsToRemove = currentPlaylistIds.filter(
        (id) => !selectedPlaylistIds.includes(id)
      );

      const addPromises = playlistsToAdd.map((playlistId) =>
        this.mediaModel.addToPlaylist(mediaId, playlistId)
      );

      const removePromises = playlistsToRemove.map((playlistId) =>
        this.mediaModel.removeFromPlaylist(mediaId, playlistId)
      );

      await Promise.all([...addPromises, ...removePromises]);

      this.closeManagePlaylistForMediaModal();
      this.renderNavigation();
      this.renderMediaGrid();

      return {
        added: playlistsToAdd.length,
        removed: playlistsToRemove.length,
      };
    } catch (error) {
      console.error("Fatal error in syncMediaWithPlaylists:", error);
      alert("Не удалось обновить плейлисты: " + error.message);
      this.closeManagePlaylistForMediaModal();
    }
  }

  showManagePlaylistForMedia(playlists, media) {
    const targetMediaId = media.id;
    const currentPlaylistIds = media.playlistIds || [];

    import("../view/add-to-playlist-modal-component.js").then((module) => {
      const ManagePlaylistModalComponent = module.default;

      this.playlistModal = new ManagePlaylistModalComponent(
        playlists,
        media.title,
        targetMediaId,
        currentPlaylistIds
      );

      document.body.appendChild(this.playlistModal.element);

      this.playlistModal.setCloseHandler(() => {
        this.closeManagePlaylistForMediaModal();
      });

      this.playlistModal.setSaveHandler((selectedPlaylistIds) => {
        this.syncMediaWithPlaylists(targetMediaId, selectedPlaylistIds);
      });
    });
  }

  closeManagePlaylistForMediaModal() {
    if (this.playlistModal && this.playlistModal.element) {
      if (this.playlistModal.element.parentNode) {
        this.playlistModal.element.parentNode.removeChild(
          this.playlistModal.element
        );
      }
      this.playlistModal = null;
    }
  }

  showPlaylistModal() {
    this.modal = new PlaylistModalComponent();
    document.body.appendChild(this.modal.element);

    this.modal.setCloseHandler(() => {
      this.closePlaylistModal();
    });

    this.modal.setCreateHandler((playlistName) => {
      this.createPlaylistFromModal(playlistName);
    });

    this.modal.focusInput();
  }

  async createPlaylistFromModal(playlistName) {
    if (playlistName) {
      try {
        await this.mediaModel.createPlaylist(playlistName);
        this.closePlaylistModal();

        this.renderNavigation();

        this.currentState.activePlaylist = "all";
        this.currentState.activeTab = "all";
        this.renderMediaGrid();
      } catch (error) {
        alert("Не удалось создать плейлист");
        console.error("Error creating playlist:", error);
      }
    }
  }

  closePlaylistModal() {
    if (this.modal && this.modal.element) {
      if (this.modal.element.parentNode) {
        this.modal.element.parentNode.removeChild(this.modal.element);
      }
      this.modal = null;
    }
  }

  handleCreatePlaylist() {
    this.showPlaylistModal();
  }

  handleManagePlaylists() {
    this.showManagePlaylistsModal();
  }

  showManagePlaylistsModal() {
    import("../view/manage-playlists-modal-component.js").then((module) => {
      const ManagePlaylistsModalComponent = module.default;
      const playlists = this.mediaModel.getPlaylists();

      this.managePlaylistsModal = new ManagePlaylistsModalComponent(playlists);
      document.body.appendChild(this.managePlaylistsModal.element);

      this.managePlaylistsModal.setCloseHandler(() => {
        this.closeManagePlaylistsModal();
      });

      this.managePlaylistsModal.setDeleteHandler((playlistId) => {
        this.handleDeletePlaylist(playlistId);
      });

      this.managePlaylistsModal.setEditHandler((playlistId, newName) => {
        this.handleEditPlaylist(playlistId, newName);
      });

      this.managePlaylistsModal.focusInput();
    });
  }

  closeManagePlaylistsModal() {
    if (this.managePlaylistsModal && this.managePlaylistsModal.element) {
      if (this.managePlaylistsModal.element.parentNode) {
        this.managePlaylistsModal.element.parentNode.removeChild(
          this.managePlaylistsModal.element
        );
      }
      this.managePlaylistsModal = null;
    }
  }

  async handleDeletePlaylist(playlistId) {
    try {
      const success = await this.mediaModel.deletePlaylist(playlistId);
      if (success) {
        if (this.currentState.activePlaylist === playlistId) {
          this.currentState.activePlaylist = "all";
          this.currentState.activeTab = "all";
        }

        this.closeManagePlaylistsModal();
        this.renderNavigation();
        this.renderMediaGrid();
      }
    } catch (error) {
      alert("Не удалось удалить плейлист");
      console.error("Error deleting playlist:", error);
    }
  }

  async handleEditPlaylist(playlistId, newName) {
    try {
      const success = await this.mediaModel.updatePlaylist(playlistId, newName);
      if (success) {
        this.closeManagePlaylistsModal();
        this.renderNavigation();
      }
    } catch (error) {
      alert("Не удалось обновить плейлист");
      console.error("Error updating playlist:", error);
    }
  }

  updateUI() {
    this.renderMediaGrid();
  }

  getState() {
    return { ...this.currentState };
  }
}
