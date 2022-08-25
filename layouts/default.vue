<template>
  <v-app dark>
    <v-app-bar fixed app class="color" dark>
      <v-toolbar-title @click="jumpHome">
        <v-icon class="pb-1">mdi-pound</v-icon>
        <span style="font-family: 'Oswald', sans-serif">{{ title }}</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="path !== '/'"
        color="light-blue darken-4"
        rounded
        to="/"
        nuxt
      >
        <v-icon
          dense
        >
          mdi-pencil
        </v-icon>
        作成
      </v-btn>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app bottom temporary right color="rgba(	29,136,66,0.9)">
      <v-list>
        <v-list-item :to="'/list'" nuxt exact>
          <v-list-item-action >
            <v-icon>mdi-border-all</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'みんなの投稿'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/'" nuxt exact>
          <v-list-item-action >
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'投稿を作成する'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/login'" nuxt exact v-if="!islogin">
          <v-list-item-action >
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'ログイン'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="`/users/${user.uid}`" nuxt exact v-else>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'マイページ'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/logout'" nuxt exact v-if="islogin">
          <v-list-item-action >
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'ログアウト'" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- fix:ナビバーの下部に表示させる -->
      <v-divider />
      <v-list >
        <!-- 利用規約 -->
        <v-list-item :to="'/terms'" nuxt dense>
          <v-list-item-content>
            <v-list-item-title v-text="'利用規約'" />
          </v-list-item-content>
        </v-list-item>
        <!-- プライバシーポリシー -->
        <v-list-item :to="'/privacy'" nuxt dense>
          <v-list-item-content>
            <v-list-item-title v-text="'プライバシーポリシー'" />
          </v-list-item-content>
        </v-list-item>
        <!-- お問合せ先 -->
        <!-- ツイッターのアカウントを問い合わせ先にする -->
        <v-list-item link href="https://twitter.com/jiffu_fu" dense>
          <v-list-item-content>
            <v-list-item-title v-text="'お問合せ'" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  head() {
    return {
      link: [ 
        { rel: 'canonical', href: process.env.SERVICE_URL + this.$route.path },
      ],
    }
  },
  head: {
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap"
      },
    ]
  },
  data() {
    return {
      drawer: false,
      user: [],
      theme: this.$store.state.thema.theme,
      title: 'MyFavoriteAlbums'
    }
  },
  mounted() {
    if (!this.$store.state.login.user) {
      this.user = []
    } else {
      this.user = this.$store.state.login.user
    }
  },
  computed: {
    islogin() {
      return this.$store.state.login.user
    },
    // pathを取得
    path() {
      return this.$route.path
    }
  },
  watch: {
    theme() {
      this.$store.dispatch("thema/theme", this.theme);
      this.$vuetify.theme.dark = this.theme;
    },
    user() {
      this.user = this.$store.state.login.user;
    }
  },
  methods: {
    jumpHome() {
      this.$router.push('/')
    },
  }
}
</script>

<style>
.color {
  background: linear-gradient(20deg, #191414, #1d8842);
}
</style>