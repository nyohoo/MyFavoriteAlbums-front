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
    const { data } = await $axios.$get('api/v1/auth/validate_token')
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

// export default {
//   layout: 'default',
//   data(){
//     return {
//       uid: false,
//       "access-token": null,
//       client: null,
//       expiry: null,
//     }
//   },
//   created() {
//     this.fetchQuery();
//     this.fetchUsers();
//   },
//   methods: {
//     fetchQuery() {
//       this.uid = this.$route.query.uid,
//       this["access-token"] = this.$route.query.auth_token,
//       this.client = this.$route.query.client_id,
//       this.expiry = this.$route.query.expiry
//     },
//     async fetchUsers() {
//       try {
//         const res = await this.$axios.get('api/v1/auth/validate_token', {
//           headers: {
//             uid: this.uid,
//             "access-token": this["access-token"],
//             client: this.client,
//             expiry: this.expiry
//           },
//         })
//         console.log(res.data)
//         this.$store.commit('login/loginUser', { token: res.headers["access-token"], client: res.headers.client,
//           uid: res.data.data.uid, name: res.data.data.name,id: res.data.data.id, email: res.data.data.email,
//           image: res.data.data.image, nickname: res.data.data.nickname
//         })
//         console.log(this.$store.state.login.token)
//         console.log(this.$store.state.login.client)
//         console.log(this.$store.state.login.uid)
//         console.log(this.$store.state.login.name)
//         console.log(this.$store.state.login.id)
//         console.log(this.$store.state.login.email)
//         console.log(this.$store.state.login.image)
//         console.log(this.$store.state.login.nickname)

//         this.$store.dispatch(
//           "message/showMessage",
//           {
//             message: "ログインしました",
//             type: "success",
//             status: true,
//           },
//         )
//         // リダイレクト
//         this.$router.push("/")
//       }
//       catch(error) {
//         console.log("エラーです")
//         console.log(error)
//       }
//     },
//   }
// }
</script>