<template>
<!-- <v-app id="login"> -->
  <v-main>
    <v-container fluid fill-height>
      <!-- ログイン時にnameを表示する -->
        <v-card class="d-flex flex-column mx-auto my-6 flat" width="50%">
          <v-card-title class="d-flex justify-center pa-0 mt-6"
            >ログイン</v-card-title
          >
          <v-card-text class="d-flex justify-center flex-column">
            <v-btn
              class="fill-width mt-6 text-capitalize caption mx-4"
              rounded
              color="#00ACEE"
              dark
              depressed
              height="48px"
              :href="twitterLoginURL"
            >
              <v-icon style="height: 20px" color="white" class="mr-2">
              mdi-twitter
              </v-icon>
              twitterでログイン
            </v-btn>
          </v-card-text>
        </v-card>
        <v-row justify="center" class="mt-6" v-show="user.id">
          <v-card
            color="transparent"
            min-width="280"
            max-width="320"
          >
            <v-list-item-avatar
              size="60"
              class="avatar-position ml-3"
            >
              <img :src="user.image">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-card-title class="m-font mt-0">
                <p class="ma-0 pa-0">{{ user.name }}</p>
              </v-card-title>
              <v-card-subtitle class="pb-1">
                @{{ user.nickname }}
              </v-card-subtitle>
            </v-list-item-content>
          </v-card>
        </v-row>
      <!-- <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4 lg4>
          <v-card class="elevation-1 pa-3">
            <v-btn :href="twitterLoginURL">
              Twitterログイン
            </v-btn>
          </v-card>
        </v-flex>
      </v-layout> -->
    </v-container>
  </v-main>
<!-- </v-app> -->
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