import UIPresenter from "./ui-presenter.js";

export default class MediaAppPresenter {
  constructor(
    headerContainer,
    navigationContainer,
    mediaContainer,
    mediaModel
  ) {
    this.mediaModel = mediaModel;
    this.uiPresenter = new UIPresenter(
      mediaModel,
      headerContainer,
      navigationContainer,
      mediaContainer
    );
    this.state = this.uiPresenter.getState();
  }

  init() {
    this.uiPresenter.init();

    this.uiPresenter.bindHeaderEvents((updates) => {
      Object.assign(this.state.filters, updates);
      this.updateMediaGrid();
    });

    this.uiPresenter.renderNavigation(
      (tabId) => this.handleTabChange(tabId),
      () => this.handleCreatePlaylist(),
      () => this.handleManagePlaylists()
    );

    this.updateMediaGrid();
  }

  updateMediaGrid() {
    const media = this.uiPresenter.getFilteredMedia(
      this.state.activePlaylist,
      this.state.filters
    );

    this.uiPresenter.renderMediaGrid(media, {
      toggleFavorite: (id) => this.handleToggleFavorite(id),
      managePlaylist: (item) => this.handleManagePlaylistForMedia(item),
      delete: (id) => this.handleDeleteMedia(id),
    });

    this.uiPresenter.renderAddButton(() => this.handleAddMedia());
  }

  handleTabChange(tabId) {
    this.state.activeTab = tabId;
    this.state.activePlaylist = tabId;
    this.uiPresenter.updateState({ activeTab: tabId, activePlaylist: tabId });
    this.uiPresenter.updateActiveTab(tabId);
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
    this.uiPresenter.showAddMediaModal(
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
          "https://lubchem.com/website/wp-content/uploads/2023/02/Shutterstock_1036735678-scaled-1000x1000.jpg",
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
    this.uiPresenter.showManagePlaylistForMedia(
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

      this.uiPresenter.renderNavigation(
        (tabId) => this.handleTabChange(tabId),
        () => this.handleCreatePlaylist(),
        () => this.handleManagePlaylists()
      );
      this.updateMediaGrid();
      return true;
    } catch (e) {
      alert("Ошибка при обновлении плейлистов");
      return false;
    }
  }

  handleCreatePlaylist() {
    this.uiPresenter.showPlaylistModal(
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
      this.uiPresenter.renderNavigation(
        (tabId) => this.handleTabChange(tabId),
        () => this.handleCreatePlaylist(),
        () => this.handleManagePlaylists()
      );
      this.state.activePlaylist = "all";
      this.state.activeTab = "all";
      this.uiPresenter.updateState({ activePlaylist: "all", activeTab: "all" });
      this.updateMediaGrid();
      return true;
    } catch (e) {
      alert("Не удалось создать плейлист");
      return false;
    }
  }

  handleManagePlaylists() {
    const playlists = this.mediaModel.getPlaylists();
    this.uiPresenter.showManagePlaylistsModal(
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
            this.uiPresenter.updateState({
              activePlaylist: "all",
              activeTab: "all",
            });
          }
          this.uiPresenter.renderNavigation(
            (tabId) => this.handleTabChange(tabId),
            () => this.handleCreatePlaylist(),
            () => this.handleManagePlaylists()
          );
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
      this.uiPresenter.renderNavigation(
        (tabId) => this.handleTabChange(tabId),
        () => this.handleCreatePlaylist(),
        () => this.handleManagePlaylists()
      );
    } catch (e) {
      alert("Не удалось обновить плейлист");
    }
  }

  getState() {
    return this.uiPresenter.getState();
  }

  destroy() {
    this.uiPresenter.destroy();
  }
}
