export default ({ store, app, $axios }) => {
  const session = app.$cookies.get('session')
  console.log(session)
  console.log("ページリロード処理")
  if (session) {
    store.commit('login/user', session.user)
    store.commit('login/auth', session.tokens)
    console.log("store/login/の中身")
    console.log(store.state.login.user)
    console.log(store.state.login.auth)
    console.log("store/login/の中身ここまで")
  }
}