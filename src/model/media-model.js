import { mockMedia, mockPlaylists } from "../mock/mock-media.js";

export default class MediaModel {
  constructor() {
    this.media = [...mockMedia];
    this.playlists = [...mockPlaylists];
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

  toggleFavorite(mediaId) {
    const media = this.media.find((m) => m.id === mediaId);
    if (media) {
      media.isFavorite = !media.isFavorite;
    }
    return media;
  }

  addMedia(newMedia) {
    const media = {
      id: Date.now(),
      isFavorite: false,
      playlistIds: [],
      ...newMedia,
    };
    this.media.push(media);
    return media;
  }

  deleteMedia(mediaId) {
    this.media = this.media.filter((m) => m.id !== mediaId);
  }

  addToPlaylist(mediaId, playlistId) {
    const media = this.media.find((m) => m.id === mediaId);
    if (media && !media.playlistIds.includes(playlistId)) {
      media.playlistIds.push(playlistId);
    }
    return media;
  }

  removeFromPlaylist(mediaId, playlistId) {
    const media = this.media.find((m) => m.id === mediaId);
    if (media) {
      media.playlistIds = media.playlistIds.filter((id) => id !== playlistId);
    }
    return media;
  }

  getPlaylists() {
    return this.playlists;
  }

  createPlaylist(name) {
    const playlist = {
      id: `playlist_${Date.now()}`,
      name,
      isDefault: false,
    };
    this.playlists.push(playlist);
    return playlist;
  }

  deletePlaylist(playlistId) {
    const playlist = this.playlists.find((p) => p.id === playlistId);
    if (playlist && !playlist.isDefault) {
      this.playlists = this.playlists.filter((p) => p.id !== playlistId);

      this.media.forEach((media) => {
        media.playlistIds = media.playlistIds.filter((id) => id !== playlistId);
      });

      return true;
    }
    return false;
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

  updatePlaylist(playlistId, newName) {
    const playlist = this.playlists.find((p) => p.id === playlistId);
    if (playlist && !playlist.isDefault && newName.trim()) {
      playlist.name = newName.trim();
      return true;
    }
    return false;
  }

  updateMedia(mediaId, updates) {
    const mediaIndex = this.media.findIndex((m) => m.id === mediaId);
    if (mediaIndex !== -1) {
      this.media[mediaIndex] = { ...this.media[mediaIndex], ...updates };
      return this.media[mediaIndex];
    }
    return null;
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
}
