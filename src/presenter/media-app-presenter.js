import HeaderPresenter from "./header-presenter.js";
import NavigationPresenter from "./navigation-presenter.js";
import MediaGridPresenter from "./media-grid-presenter.js";
import ModalManager from "./modal-manager-presenter.js";

export default class MediaAppPresenter {
  constructor(
    headerContainer,
    navigationContainer,
    mediaContainer,
    mediaModel
  ) {
    this.mediaModel = mediaModel;
    this.modalManager = new ModalManager(mediaModel);

    this.state = {
      filters: { type: "all", genre: "all", search: "" },
      activePlaylist: "all",
      activeTab: "all",
    };

    this.headerPresenter = new HeaderPresenter(headerContainer, (updates) => {
      Object.assign(this.state.filters, updates);
      this.updateMediaGrid();
    });

    this.navigationPresenter = new NavigationPresenter(
      navigationContainer,
      mediaModel,
      (tabId) => this.handleTabChange(tabId),
      () => this.handleCreatePlaylist(),
      () => this.handleManagePlaylists()
    );

    this.mediaGridPresenter = new MediaGridPresenter(
      mediaContainer,
      mediaModel,
      () => this.handleAddMedia(),
      {
        toggleFavorite: (id) => this.handleToggleFavorite(id),
        managePlaylist: (item) => this.handleManagePlaylistForMedia(item),
        delete: (id) => this.handleDeleteMedia(id),
      }
    );
  }

  init() {
    this.headerPresenter.init();
    this.navigationPresenter.init();
    this.updateMediaGrid();
  }

  getFilteredMedia() {
    let media = this.mediaModel.getMediaForPlaylist(this.state.activePlaylist);
    const f = this.state.filters;
    return media.filter((item) => {
      const typeMatch = f.type === "all" || item.type === f.type;
      const genreMatch = f.genre === "all" || item.genre === f.genre;
      const searchMatch =
        !f.search || item.title.toLowerCase().includes(f.search.toLowerCase());
      return typeMatch && genreMatch && searchMatch;
    });
  }

  updateMediaGrid() {
    const media = this.getFilteredMedia();
    this.mediaGridPresenter.render(media);
  }

  handleTabChange(tabId) {
    this.state.activeTab = tabId;
    this.state.activePlaylist = tabId;
    this.navigationPresenter.updateActiveTab(tabId);
    this.updateMediaGrid();
  }

  async handleToggleFavorite(mediaId) {
    try {
      await this.mediaModel.toggleFavorite(mediaId);
      this.updateMediaGrid();
    } catch (e) {
      alert("Не удалось изменить избранное");
    }
  }

  async handleDeleteMedia(mediaId) {
    if (confirm("Удалить?")) {
      try {
        await this.mediaModel.deleteMedia(mediaId);
        this.updateMediaGrid();
      } catch (e) {
        alert("Не удалось удалить");
      }
    }
  }

  handleAddMedia() {
    this.modalManager.showAddMediaModal(
      async (data, close) => {
        if (await this.handleCreateMedia(data)) {
          close();
        }
      },
      () => {}
    );
  }

  async handleCreateMedia(mediaData) {
    try {
      await this.mediaModel.addMedia({
        ...mediaData,
        image:
          mediaData.image ||
          "https://via.placeholder.com/300x450?text=No+Image",
      });
      this.updateMediaGrid();
      return true;
    } catch (e) {
      alert("Не удалось создать");
      return false;
    }
  }

  handleManagePlaylistForMedia(media) {
    const playlists = this.mediaModel.getPlaylists();
    this.modalManager.showManagePlaylistForMedia(
      playlists,
      media,
      async (selectedIds, close) => {
        if (await this.syncMediaWithPlaylists(media.id, selectedIds)) {
          close();
        }
      },
      () => {}
    );
  }

  async syncMediaWithPlaylists(mediaId, selectedIds) {
    try {
      const media = this.mediaModel.getMediaById(mediaId);
      if (!media) throw new Error("Медиа не найдено");
      const current = media.playlistIds || [];
      const toAdd = selectedIds.filter((id) => !current.includes(id));
      const toRemove = current.filter((id) => !selectedIds.includes(id));

      await Promise.all([
        ...toAdd.map((id) => this.mediaModel.addToPlaylist(mediaId, id)),
        ...toRemove.map((id) =>
          this.mediaModel.removeFromPlaylist(mediaId, id)
        ),
      ]);

      this.navigationPresenter.render();
      this.updateMediaGrid();
      return true;
    } catch (e) {
      alert("Ошибка при обновлении плейлистов");
      return false;
    }
  }

  handleCreatePlaylist() {
    this.modalManager.showPlaylistModal(
      async (name, close) => {
        if (await this.createPlaylist(name)) {
          close();
        }
      },
      () => {}
    );
  }

  async createPlaylist(name) {
    if (!name?.trim()) return false;
    try {
      await this.mediaModel.createPlaylist(name.trim());
      this.navigationPresenter.render();
      this.state.activePlaylist = "all";
      this.state.activeTab = "all";
      this.updateMediaGrid();
      return true;
    } catch (e) {
      alert("Не удалось создать плейлист");
      return false;
    }
  }

  handleManagePlaylists() {
    const playlists = this.mediaModel.getPlaylists();
    this.modalManager.showManagePlaylistsModal(
      playlists,
      (id, close) => this.handleDeletePlaylist(id, close),
      (id, name, close) => this.handleEditPlaylist(id, name, close),
      () => {}
    );
  }

  async handleDeletePlaylist(id, close) {
    if (confirm("Вы уверены, что хотите удалить этот плейлист?")) {
      try {
        const success = await this.mediaModel.deletePlaylist(id);
        if (success) {
          if (this.state.activePlaylist === id) {
            this.state.activePlaylist = "all";
            this.state.activeTab = "all";
          }
          this.navigationPresenter.render();
          this.updateMediaGrid();
          close();
        }
      } catch (e) {
        alert("Не удалось удалить плейлист");
      }
    }
  }

  async handleEditPlaylist(id, name) {
    try {
      await this.mediaModel.updatePlaylist(id, name);
      this.navigationPresenter.render();
    } catch (e) {
      alert("Не удалось обновить плейлист");
    }
  }

  getState() {
    return { ...this.state };
  }
}
