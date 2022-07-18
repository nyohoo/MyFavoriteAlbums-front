export const state = () => ({
  user: null,
  auth: {},
  drawer: true
})

export const mutations = {
  user(state, value) {
    state.user = value
  },
  auth(state, value) {
    state.auth = value
  },
  toggleDrawer(state) {
    state.drawer = !state.drawer
  },
  drawer(state, val) {
    state.drawer = val
  },
}