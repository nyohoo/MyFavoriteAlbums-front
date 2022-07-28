import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() =>{
    createPersistedState({
    key: 'albums',
    paths: ["albums.albums"],
    })(store)
  })
}