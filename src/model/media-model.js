export default class MediaModel {
  constructor({ mediaApiService }) {
    this.media = [];
    this.playlists = [];
    this.#mediaApiServise = mediaApiService;
    this.isLoaded = false;
    this.loadData();
  }

  async loadData() {
    try {
      const [apiMedia, apiPlaylists] = await Promise.all([
        this.#mediaApiServise.getMedia(),
        this.#mediaApiServise.getPlaylists(),
      ]);

      if (apiMedia && apiMedia.length > 0) {
        this.media = apiMedia;
      }

      if (apiPlaylists && apiPlaylists.length > 0) {
        this.playlists = apiPlaylists;
      }

      this.isLoaded = true;
    } catch (error) {
      console.error("Failed to load data from API:", error);
      this.isLoaded = true;
    }
  }

  getMedia() {
    return this.media;
  }

  filterMedia({ type = "all", genre = "all", search = "" }) {
    return this.media.filter((item) => {
      const typeMatch = type === "all" || item.type === type;
      const genreMatch = genre === "all" || item.genre === genre;
      const searchMatch =
        !search || item.title.toLowerCase().includes(search.toLowerCase());

      return typeMatch && genreMatch && searchMatch;
    });
  }

  getMediaById(id) {
    return this.media.find((item) => item.id === id);
  }

  async toggleFavorite(mediaId) {
    try {
      const media = this.media.find((m) => m.id === mediaId);
      if (media) {
        media.isFavorite = !media.isFavorite;
        await this.#mediaApiServise.updateMedia(mediaId, {
          isFavorite: media.isFavorite,
        });
      }
      return media;
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      throw error;
    }
  }

  getPlaylistById(playlistId) {
    return this.playlists.find((p) => p.id === playlistId);
  }

  isMediaInPlaylist(mediaId, playlistId) {
    const media = this.getMediaById(mediaId);
    return media ? media.playlistIds.includes(playlistId) : false;
  }

  getCustomPlaylists() {
    return this.playlists.filter((p) => !p.isDefault);
  }

  getPlaylists() {
    return this.playlists;
  }

  getMediaForPlaylist(playlistId) {
    if (playlistId === "all") {
      return this.media;
    } else if (playlistId === "favorites") {
      return this.media.filter((m) => m.isFavorite);
    } else {
      return this.media.filter((m) => m.playlistIds.includes(playlistId));
    }
  }

  async addMedia(newMedia) {
    try {
      const createdMedia = await this.#mediaApiServise.createMedia({
        ...newMedia,
        isFavorite: false,
        playlistIds: [],
      });

      this.media.push(createdMedia);
      return createdMedia;
    } catch (error) {
      console.error("Failed to add media:", error);
      throw error;
    }
  }

  async deleteMedia(mediaId) {
    try {
      await this.#mediaApiServise.deleteMedia(mediaId);

      this.media = this.media.filter((m) => m.id !== mediaId);
      return true;
    } catch (error) {
      console.error("Failed to delete media:", error);
      throw error;
    }
  }

  async addToPlaylist(mediaId, playlistId) {
    try {
      const media = this.media.find((m) => String(m.id) === String(mediaId));
      if (!media) {
        throw new Error(`Медиа с ID ${mediaId} не найдено`);
      }

      const playlist = this.playlists.find(
        (p) => String(p.id) === String(playlistId)
      );
      if (!playlist) {
        throw new Error(`Плейлист с ID ${playlistId} не найден`);
      }

      if (media.playlistIds && media.playlistIds.includes(playlistId)) {
        return media;
      }

      if (!media.playlistIds) {
        media.playlistIds = [];
      }

      media.playlistIds.push(playlistId);

      await this.#mediaApiServise.updateMedia(mediaId, {
        playlistIds: media.playlistIds,
      });

      return media;
    } catch (error) {
      console.error("Failed to add to playlist:", error);
      const enhancedError = new Error(
        `Не удалось добавить медиа ${mediaId} в плейлист ${playlistId}: ${error.message}`
      );
      enhancedError.originalError = error;
      throw enhancedError;
    }
  }

  async removeFromPlaylist(mediaId, playlistId) {
    try {
      const media = this.media.find((m) => String(m.id) === String(mediaId));
      if (media) {
        media.playlistIds = media.playlistIds.filter(
          (id) => String(id) !== String(playlistId)
        );

        await this.#mediaApiServise.updateMedia(mediaId, {
          playlistIds: media.playlistIds,
        });
      }
      return media;
    } catch (error) {
      console.error("Failed to remove from playlist:", error);
      throw error;
    }
  }

  async createPlaylist(name) {
    try {
      const playlistData = {
        name: name,
        isDefault: false,
        createdAt: new Date().toISOString(),
        mediaIds: [],
      };

      const createdPlaylist = await this.#mediaApiServise.createPlaylist(
        playlistData
      );

      this.playlists.push(createdPlaylist);
      return createdPlaylist;
    } catch (error) {
      console.error("Failed to create playlist:", error);
      throw error;
    }
  }

  async deletePlaylist(playlistId) {
    try {
      const playlist = this.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.isDefault) {
        await this.#mediaApiServise.deletePlaylist(playlistId);

        this.playlists = this.playlists.filter((p) => p.id !== playlistId);

        const updatePromises = this.media.map(async (media) => {
          if (media.playlistIds.includes(playlistId)) {
            media.playlistIds = media.playlistIds.filter(
              (id) => id !== playlistId
            );
            return this.#mediaApiServise.updateMedia(media.id, {
              playlistIds: media.playlistIds,
            });
          }
          return Promise.resolve();
        });

        await Promise.all(updatePromises);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete playlist:", error);
      throw error;
    }
  }

  async updatePlaylist(playlistId, newName) {
    try {
      const playlist = this.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.isDefault && newName.trim()) {
        playlist.name = newName.trim();

        const updatedPlaylist = await this.#mediaApiServise.updatePlaylist(
          playlistId,
          {
            name: playlist.name,
            isDefault: playlist.isDefault || false,
            createdAt: playlist.createdAt || new Date().toISOString(),
          }
        );

        Object.assign(playlist, updatedPlaylist);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update playlist:", error);
      throw error;
    }
  }

  async updateMedia(mediaId, updates) {
    try {
      const mediaIndex = this.media.findIndex((m) => m.id === mediaId);
      if (mediaIndex !== -1) {
        this.media[mediaIndex] = { ...this.media[mediaIndex], ...updates };

        const updatedMedia = await this.#mediaApiServise.updateMedia(
          mediaId,
          this.media[mediaIndex]
        );

        this.media[mediaIndex] = updatedMedia;
        return updatedMedia;
      }
      return null;
    } catch (error) {
      console.error("Failed to update media:", error);
      throw error;
    }
  }

  getMediaInPlaylist(playlistId) {
    return this.media.filter((m) => m.playlistIds.includes(playlistId));
  }

  #mediaApiServise = null;
}
