import { mockMedia, mockPlaylists } from "../mock/mock-media.js";

export default class MediaModel {
  constructor() {
    this.media = [...mockMedia];
    this.playlists = [...mockPlaylists];
  }

  // Получить все медиа
  getMedia() {
    return this.media;
  }

  // Фильтрация медиа
  filterMedia({ type = "all", genre = "all", search = "" }) {
    return this.media.filter((item) => {
      const typeMatch = type === "all" || item.type === type;
      const genreMatch = genre === "all" || item.genre === genre;
      const searchMatch =
        !search || item.title.toLowerCase().includes(search.toLowerCase());

      return typeMatch && genreMatch && searchMatch;
    });
  }

  // Получить медиа по ID
  getMediaById(id) {
    return this.media.find((item) => item.id === id);
  }

  // Переключить избранное
  toggleFavorite(mediaId) {
    const media = this.media.find((m) => m.id === mediaId);
    if (media) {
      media.isFavorite = !media.isFavorite;
    }
    return media;
  }

  // Добавить новое медиа
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

  // Удалить медиа
  deleteMedia(mediaId) {
    this.media = this.media.filter((m) => m.id !== mediaId);
  }

  // Добавить в плейлист
  addToPlaylist(mediaId, playlistId) {
    const media = this.media.find((m) => m.id === mediaId);
    if (media && !media.playlistIds.includes(playlistId)) {
      media.playlistIds.push(playlistId);
    }
    return media;
  }

  // Удалить из плейлиста
  removeFromPlaylist(mediaId, playlistId) {
    const media = this.media.find((m) => m.id === mediaId);
    if (media) {
      media.playlistIds = media.playlistIds.filter((id) => id !== playlistId);
    }
    return media;
  }

  // Получить все плейлисты
  getPlaylists() {
    return this.playlists;
  }

  // Создать плейлист
  createPlaylist(name) {
    console.log("Creating playlist:", name); // Отладка
    const playlist = {
      id: `playlist_${Date.now()}`,
      name,
      isDefault: false,
    };
    this.playlists.push(playlist);
    console.log("Playlists after creation:", this.playlists); // Отладка
    return playlist;
  }
  // Удалить плейлист
  deletePlaylist(playlistId) {
    const playlist = this.playlists.find((p) => p.id === playlistId);
    if (playlist && !playlist.isDefault) {
      this.playlists = this.playlists.filter((p) => p.id !== playlistId);

      // Удаляем ссылки на плейлист из медиа
      this.media.forEach((media) => {
        media.playlistIds = media.playlistIds.filter((id) => id !== playlistId);
      });

      return true;
    }
    return false;
  }

  // Получить медиа для плейлиста
  getMediaForPlaylist(playlistId) {
    if (playlistId === "all") {
      return this.media;
    } else if (playlistId === "favorites") {
      return this.media.filter((m) => m.isFavorite);
    } else {
      return this.media.filter((m) => m.playlistIds.includes(playlistId));
    }
  }
  // Обновить плейлист
  updatePlaylist(playlistId, newName) {
    const playlist = this.playlists.find((p) => p.id === playlistId);
    if (playlist && !playlist.isDefault && newName.trim()) {
      playlist.name = newName.trim();
      return true;
    }
    return false;
  }

  // Обновить медиа
  updateMedia(mediaId, updates) {
    const mediaIndex = this.media.findIndex((m) => m.id === mediaId);
    if (mediaIndex !== -1) {
      this.media[mediaIndex] = { ...this.media[mediaIndex], ...updates };
      return this.media[mediaIndex];
    }
    return null;
  }

  // Получить плейлист по ID
  getPlaylistById(playlistId) {
    return this.playlists.find((p) => p.id === playlistId);
  }

  // Проверить, находится ли медиа в плейлисте
  isMediaInPlaylist(mediaId, playlistId) {
    const media = this.getMediaById(mediaId);
    return media ? media.playlistIds.includes(playlistId) : false;
  }

  // Получить все пользовательские плейлисты (исключая системные)
  getCustomPlaylists() {
    return this.playlists.filter((p) => !p.isDefault);
  }
}
