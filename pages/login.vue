<template>
<v-app id="login" class="primary">
  <v-main>
    <v-container fluid fill-height>
      <!-- ログイン時にnameを表示する -->
      <v-card-title>
        <span class="headline">{{ user.name }}</span>
      </v-card-title>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4 lg4>
          <v-card class="elevation-1 pa-3">
            <v-btn :href="twitterLoginURL">
              Twitterログイン
            </v-btn>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</v-app>
</template>

<script>
export default {
  layout: 'default',
  data: () => ({
    twitter: {
      url: 'http://localhost:3000/api/v1/auth/twitter',
      redirectUrl: 'http://localhost:8080/oauth/twitter/callback'
    },
  }),
  computed: {
    twitterLoginURL() {
      return `${this.twitter.url}?auth_origin_url=${encodeURI(this.twitter.redirectUrl)}`
    },
    user() {
      return this.$store.state.login.user || {}
    },
  },
};
</script>