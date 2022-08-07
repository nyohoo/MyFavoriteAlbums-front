<template>
  <div></div>
</template>

<script>
export default {
  async fetch({ query, store, $axios, redirect, app }) {
    const authHeaders = {
      'access-token': query.auth_token,
      'client': query.client_id,
      'uid': query.uid,
      'expiry': query.expiry,
    }
    store.commit('login/auth', authHeaders)
    const { data } = await $axios.$get('auth/validate_token')
    store.commit('login/user', data)
    const session = {
      tokens: authHeaders,
      user: data
    }
    app.$cookies.set('session', session, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
    redirect(301, '/')
  }
}
</script>