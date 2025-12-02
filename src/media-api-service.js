import ApiService from "./framework/view/api-service.js";

const Method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export default class MediaApiService extends ApiService {
  async getMedia() {
    const response = await this._load({ url: "media" });
    return await ApiService.parseResponse(response);
  }

  async getMediaById(id) {
    const response = await this._load({ url: `media/${id}` });
    return await ApiService.parseResponse(response);
  }

  async createMedia(mediaData) {
    const response = await this._load({
      url: "media",
      method: Method.POST,
      body: mediaData,
    });
    return await ApiService.parseResponse(response);
  }

  async updateMedia(id, mediaData) {
    const response = await this._load({
      url: `media/${id}`,
      method: Method.PUT,
      body: mediaData,
    });
    return await ApiService.parseResponse(response);
  }

  async deleteMedia(id) {
    const response = await this._load({
      url: `media/${id}`,
      method: Method.DELETE,
    });
    return await ApiService.parseResponse(response);
  }

  async getPlaylists() {
    const response = await this._load({ url: "playlists" });
    return await ApiService.parseResponse(response);
  }

  async getPlaylistById(id) {
    const response = await this._load({ url: `playlists/${id}` });
    return await ApiService.parseResponse(response);
  }

  async createPlaylist(playlistData) {
    const response = await this._load({
      url: "playlists",
      method: Method.POST,
      body: playlistData,
    });
    return await ApiService.parseResponse(response);
  }

  async updatePlaylist(id, playlistData) {
    const response = await this._load({
      url: `playlists/${id}`,
      method: Method.PUT,
      body: playlistData,
    });
    return await ApiService.parseResponse(response);
  }

  async deletePlaylist(id) {
    const response = await this._load({
      url: `playlists/${id}`,
      method: Method.DELETE,
    });
    return await ApiService.parseResponse(response);
  }
}
