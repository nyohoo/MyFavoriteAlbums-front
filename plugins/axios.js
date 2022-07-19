export let axios;

export default ({ $axios, store, app }) => {
  $axios.onRequest(config => {
    const headers = store.state.login.auth
    console.log("headers状態")
    console.log(headers)
    console.log("headers状態ここまで")
    config.headers = headers
  });

  $axios.onResponse(response => {
    if (response.headers['access-token']) {
      const authHeaders = {
        'access-token': response.headers['access-token'],
        'client': response.headers['client'],
        'expiry': response.headers['expiry'],
        'uid': response.headers['uid']
      }
      store.commit('login/auth', authHeaders)

      const session = app.$cookies.get('session')
      if (session) {
        session.tokens = authHeaders
        app.$cookies.set('session', session, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        })
      }
  }
});
$axios.onError(error => {
  console.log("errorです")
  return Promise.reject(error.response);
});

 axios = $axios;
}