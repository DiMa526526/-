export const mockMedia = [
  {
    id: 1,
    title: "Начало",
    type: "film",
    genre: "sci-fi",
    image:
      "https://avatars.mds.yandex.net/i?id=55234770853d2b9b0d04c21ef80ac927876bea07-5246350-images-thumbs&n=13",
    isFavorite: true,
    playlistIds: [],
  },
  {
    id: 2,
    title: "Очень странные дела",
    type: "series",
    genre: "horror",
    image:
      "https://avatars.mds.yandex.net/i?id=e8426d1af054b2b35e4fe75da43ae65cc15da90e-16115452-images-thumbs&n=13",
    isFavorite: false,
    playlistIds: ["playlist1"],
  },
  {
    id: 3,
    title: "Достать ножи",
    type: "film",
    genre: "detective",
    image:
      "https://pr6.zoon.ru/PhJoC-wYrnxwiklxhMkPIg/600x900%2Cq85/SpS0r36yAVMNnD-E09g7J4Ftn_kjw7RILY1x59M9cnd2YWVMMFqRNHaBv__fDYFdm60zFZUB0Hctpd3PBWZ9IhDRwXAfHawqSnE5gGkSuXn3E4ZxYvStW4ZuC9YM7GripfGVZTrhAiQ2SbjzHiYEK2_sokfHVqN5wswTJ3YlaGHeGwiKFrCqNibA9MMe6AGs8vcxCOkuS4gIcDEbR9nYXGYR1_WkPtvfFFHCTvB-Hr1K7pNYcTJ4j_LptPRKapK7541wDgNj0c5E5Pp3xB1m6dIod2NjJ75iIguwpFA5YnWTvL7Mt0FfX-A0galJlBtH4_VVVcaB3Bk5lMQYllBCAQ",
    isFavorite: false,
    playlistIds: [],
  },
  {
    id: 4,
    title: "Сверхъестественное",
    type: "series",
    genre: "mystic",
    image:
      "https://avatars.mds.yandex.net/get-mpic/5304425/2a000001939991c559fa7494be5431563279/orig",
    isFavorite: true,
    playlistIds: ["playlist1"],
  },
  {
    id: 5,
    title: "Маска",
    type: "film",
    genre: "fantasy",
    image:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1777765/51ed579c-586d-48a4-a6ec-837738159f33/orig",
    isFavorite: false,
    playlistIds: [],
  },
  {
    id: 6,
    title: "Интерстеллар",
    type: "film",
    genre: "sci-fi",
    image:
      "https://avatars.mds.yandex.net/get-mpic/5216721/2a00000193e1a7de6a906af46b87fc5dc3cc/orig",
    isFavorite: true,
    playlistIds: [],
  },
  {
    id: 7,
    title: "Ведьмак",
    type: "series",
    genre: "fantasy",
    image: "https://cdn1.ozone.ru/s3/multimedia-1-s/7026552856.jpg",
    isFavorite: false,
    playlistIds: [],
  },
  {
    id: 8,
    title: "Оно",
    type: "film",
    genre: "horror",
    image:
      "https://www.film.ru/sites/default/files/styles/thumb_1024x450/public/filefield_paths/it-2926556-o-.jpg",
    isFavorite: false,
    playlistIds: [],
  },
];

export const mockPlaylists = [
  { id: "all", name: "Вся медиатека", isDefault: true },
  { id: "favorites", name: "Избранное", isDefault: true },
  { id: "playlist1", name: "Вечерний просмотр", isDefault: false },
];
