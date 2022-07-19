export default function ({ store, route }) {
  if (store.state.login.user) return Promise.resolve()

  if (route.path === 'http://localhost:8080/login') return Promise.resolve()

  if (route.path.match(/^\/oauth\/.+\/callback$/)) return Promise.resolve()

  window.location.href = 'http://localhost:8080/login'
  return new Promise((resolve) => {})
}