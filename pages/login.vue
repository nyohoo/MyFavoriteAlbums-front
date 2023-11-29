<!-- TwitterAPI対応 ログインは暫定としてしない仕様とする -->

<template>
  <v-container fluid fill-height>
    <!-- ログイン時にnameを表示する -->
    <v-card class="d-flex flex-column mx-auto my-6 flat" width="50vh">
      <v-card-title class="d-flex justify-center pa-0 mt-6">ログイン</v-card-title>
      <v-card-text class="d-flex justify-center flex-column">
        <v-btn class="fill-width mt-6 text-capitalize caption mx-4" rounded color="#00ACEE" dark depressed height="48px"
          :href="twitterLoginURL">
          <v-icon style="height: 20px" color="white" class="mr-2">
            mdi-twitter
          </v-icon>
          twitterでログイン
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  middleware({ store, redirect }) {
    if (store.state.login.user) {
      redirect('/');
    }
  },
  head() {
    return {
      title: 'ログイン',
      meta: [
        {
          name: 'description',
          content: 'ログインページです。',
        },
      ],
    };
  },
  data() {
    return {
      twitter: {
        url: process.env.BASE_URL + "auth/twitter",
        redirectUrl: process.env.CALL_BACK
      },
    };
  },
  computed: {
    twitterLoginURL() {
      return `${this.twitter.url}?auth_origin_url=${encodeURI(this.twitter.redirectUrl)}`
    },
  },
};
</script>