export const state = () => ({
  albums: [],
  hashtag: '',
});

export const actions = {
  addAlbums({ commit }, album) {
    commit("addAlbums", album);
  },
  deleteAlbums({ commit }, album) {
    commit("deleteAlbums", album);
  },
  updateAlbums({ commit }, albums) {
    commit("updateAlbums", albums);
  },
  deleteAllAlbums({ commit }) {
    commit("deleteAllAlbums");
  },
  addHashtag({ commit }, hashtag) {
    commit("addHashtag", hashtag);
  },
  clearAlbums({ commit }) {
    commit("clearAlbums");
  },
};

export const mutations = {
  addAlbums(state, album) {
    state.albums.push(album);
  },
  deleteAlbums(state, album) {
    state.albums = state.albums.filter((element) => element.id !== album.id);
  },
  updateAlbums(state, albums) {
    state.albums = albums;
  },
  deleteAllAlbums(state) {
    state.albums = [];
  },
  createAlbums(state, albums) {
    state.albums = albums;
  },
  addHashtag(state, hashtag) {
    state.hashtag = hashtag;
  },
  clearAlbums(state) {
    state.albums = [];
    state.hashtag = '';
  },
};
