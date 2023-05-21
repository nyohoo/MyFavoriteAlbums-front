import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() =>{
    createPersistedState({
      key: 'myPersistedState',
      paths: [
          "albums.albums",
          "albums.hashtag",
          "message.message",
          "message.type",
          "message.status",
      ],
    })(store)
  })
}