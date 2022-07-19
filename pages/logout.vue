<template>
<!-- ログアウト -->
<v-container fluid>
  <v-row justify="center">
    <v-col cols="12" sm="12" md="12" lg="12" xl="12">
      <v-card>
        <v-card-title>
          <span class="headline">ログアウト</span>
        </v-card-title>
        <v-card-text>
          <v-btn @click="handleLogout">ログアウト</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { axios } from '@/plugins/axios';

export default {
  middleware: 'redirect',
  methods: {
    async handleLogout() {
      await axios.$delete('api/v1/auth/sign_out')
      this.$cookies.removeAll()
      this.$store.commit('login/user', {})
      this.$store.commit('login/auth', null)
      this.$router.push('/')
    },
  },
}
</script>