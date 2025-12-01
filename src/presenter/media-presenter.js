import MediaModel from "../model/media-model.js";
import HeaderComponent from "../view/header-component.js";
import NavigationComponent from "../view/navigation-component.js";
import MediaGridComponent from "../view/media-grid-component.js";
import MediaCardComponent from "../view/media-card-component.js";
import AddCardButtonComponent from "../view/add-card-button-component.js";
import PlaylistModalComponent from "../view/playlist-modal-component.js";
import { render } from "../framework/render.js";

export default class MediaPresenter {
  constructor(headerContainer, navigationContainer, mediaContainer) {
    this.headerContainer = headerContainer;
    this.navigationContainer = navigationContainer;
    this.mediaContainer = mediaContainer;
    this.modal = null;
    this.addMediaModal = null;

    this.mediaModel = new MediaModel();

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

    console.log("Navigation rendered with playlists:", playlists);
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
        this.handleAddToPlaylist(media);
      });
    }

    const deleteBtn = cardElement.querySelector(".delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        this.handleDeleteMedia(media.id);
      });
    }
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

  handleToggleFavorite(mediaId) {
    this.mediaModel.toggleFavorite(mediaId);
    this.renderMediaGrid();
  }

  handleDeleteMedia(mediaId) {
    if (confirm("Вы уверены, что хотите удалить этот элемент?")) {
      this.mediaModel.deleteMedia(mediaId);
      this.renderMediaGrid();
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

  handleCreateMedia(mediaData) {
    const newMedia = {
      title: mediaData.title,
      type: mediaData.type,
      genre: mediaData.genre,
      image:
        mediaData.image || "https://via.placeholder.com/300x450?text=No+Image",
    };

    this.mediaModel.addMedia(newMedia);
    this.closeAddMediaModal();
    this.renderMediaGrid();
  }

  handleAddToPlaylist(media) {
    const playlists = this.mediaModel.getPlaylists();
    this.showAddToPlaylistModal(playlists, media);
  }

  showAddToPlaylistModal(playlists, media) {
    import("../view/add-to-playlist-modal-component.js").then((module) => {
      const AddToPlaylistModalComponent = module.default;

      this.playlistModal = new AddToPlaylistModalComponent(
        playlists,
        media.title
      );

      document.body.appendChild(this.playlistModal.element);

      this.playlistModal.setCloseHandler(() => {
        this.closeAddToPlaylistModal();
      });

      this.playlistModal.setAddHandler((selectedPlaylistIds) => {
        this.addMediaToPlaylists(media.id, selectedPlaylistIds);
      });
    });
  }

  addMediaToPlaylists(mediaId, playlistIds) {
    playlistIds.forEach((playlistId) => {
      this.mediaModel.addToPlaylist(mediaId, playlistId);
    });

    if (playlistIds.length > 0) {
      alert("Медиа добавлено в выбранные плейлисты!");
    }

    this.closeAddToPlaylistModal();

    this.renderNavigation();
  }

  closeAddToPlaylistModal() {
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

    // Фокусируемся на поле ввода
    this.modal.focusInput();
  }

  createPlaylistFromModal(playlistName) {
    if (playlistName) {
      this.mediaModel.createPlaylist(playlistName);
      this.closePlaylistModal();

      // Полностью перерисовываем навигацию
      this.renderNavigation();

      // Сбрасываем активную вкладку на "all"
      this.currentState.activePlaylist = "all";
      this.currentState.activeTab = "all";
      this.renderMediaGrid();
    }
  }

  closePlaylistModal() {
    if (this.modal && this.modal.element) {
      // Удаляем элемент из DOM
      if (this.modal.element.parentNode) {
        this.modal.element.parentNode.removeChild(this.modal.element);
      }
      this.modal = null;
    }
  }

  // Создание плейлиста
  handleCreatePlaylist() {
    this.showPlaylistModal();
  }

  // Управление плейлистами (заглушка для будущего функционала)
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

  handleDeletePlaylist(playlistId) {
    const success = this.mediaModel.deletePlaylist(playlistId);
    if (success) {
      // Если удаляем активный плейлист, переключаемся на "all"
      if (this.currentState.activePlaylist === playlistId) {
        this.currentState.activePlaylist = "all";
        this.currentState.activeTab = "all";
      }

      this.closeManagePlaylistsModal();
      this.renderNavigation();
      this.renderMediaGrid();
    }
  }

  // Редактировать плейлист
  handleEditPlaylist(playlistId, newName) {
    const success = this.mediaModel.updatePlaylist(playlistId, newName);
    if (success) {
      this.closeManagePlaylistsModal();
      this.renderNavigation();
      // Не перерисовываем медиа-грид, т.к. это не влияет на отображение карточек
    }
  }

  // Обновление UI (можно использовать для оптимизации вместо полной перерисовки)
  updateUI() {
    this.renderMediaGrid();
  }

  // Получение текущего состояния (для отладки)
  getState() {
    return { ...this.currentState };
  }
}
