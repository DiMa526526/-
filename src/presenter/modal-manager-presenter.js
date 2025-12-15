export default class ModalManager {
  constructor(mediaModel) {
    this.mediaModel = mediaModel;
    this.currentModal = null;
  }

  open(modalElement) {
    if (this.currentModal) {
      this.close();
    }
    document.body.appendChild(modalElement);
    this.currentModal = modalElement;
  }

  close() {
    if (this.currentModal) {
      this.currentModal.remove();
      this.currentModal = null;
    }
  }

  showAddMediaModal(onSubmit, onClose) {
    import("../view/add-media-modal-component.js").then((module) => {
      const AddMediaModalComponent = module.default;
      const modal = new AddMediaModalComponent();
      const close = () => {
        onClose();
        this.close();
      };
      modal.setCloseHandler(close);
      modal.setSubmitHandler((data) => onSubmit(data, close));
      modal.focusInput();
      this.open(modal.element);
    });
  }

  showPlaylistModal(onCreate, onClose) {
    import("../view/playlist-modal-component.js").then((module) => {
      const PlaylistModalComponent = module.default;
      const modal = new PlaylistModalComponent();
      const close = () => {
        onClose();
        this.close();
      };
      modal.setCloseHandler(close);
      modal.setCreateHandler((name) => onCreate(name, close));
      modal.focusInput();
      this.open(modal.element);
    });
  }

  showManagePlaylistsModal(playlists, onDelete, onEdit, onClose) {
    import("../view/manage-playlists-modal-component.js").then((module) => {
      const ManagePlaylistsModalComponent = module.default;
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
    });
  }

  showManagePlaylistForMedia(playlists, media, onSave, onClose) {
    import("../view/add-to-playlist-modal-component.js").then((module) => {
      const ManagePlaylistModalComponent = module.default;
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
    });
  }
}
