<template>
  <!-- ログアウト -->
  <v-container fluid fill-height>
    <v-card class="d-flex flex-column mx-auto my-6 flat" width="50vh">
      <v-card-title class="d-flex justify-center pa-0 mt-6">ログアウト</v-card-title>
      <v-card-text class="d-flex justify-center flex-column">
        <v-btn class="fill-width mt-6 text-capitalize caption mx-4" rounded color="#00ACEE" dark depressed height="48px"
          @click="handleLogout">
          <v-icon style="height: 20px" color="white" class="mr-2">
            mdi-logout
          </v-icon>
          ログアウトする
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { axios } from '@/plugins/axios';

export default {
  middleware({ store, redirect }) {
    if (!store.state.login.user) {
      redirect('/login');
    }
  },
  head() {
    return {
      title: 'ログアウト',
      meta: [
        {
          name: 'description',
          content: 'ログアウトページです。'
        },
        {
          name: 'keywords',
          content: 'ログアウト, ログアウトページ'
        }
      ]
    }
  },
  methods: {
    async handleLogout() {
        await axios.delete('auth/sign_out')
        this.$cookies.removeAll();
        this.$store.commit('login/user', {});
        this.$store.commit('login/auth', null);
        window.localStorage.removeItem('albums');
        window.location.href = '/'
    },
  },
}
</script>