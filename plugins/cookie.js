export default ({ store, app, $axios }) => {
  const session = app.$cookies.get('session')
  if (session) {
    store.commit('login/user', session.user)
    store.commit('login/auth', session.tokens)
  }
}