<template>
  <v-app dark>
    <v-app-bar fixed app class="color" dark>
      <v-icon dense>mdi-pound</v-icon>
      <v-toolbar-title>
        <span style="font-family: 'Oswald', sans-serif">{{ title }}</span>
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app bottom temporary right color="rgba(	29,136,66,0.9)">
      <v-list>
        <v-list-item :to="'/list'" nuxt exact>
          <v-list-item-action >
            <v-icon>mdi-border-all</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'最近の投稿をみる'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/'" nuxt exact>
          <v-list-item-action >
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'投稿作成'" />
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
        <v-list-item :to="'/terms'" nuxt  dense>
          <v-list-item-content>
            <v-list-item-title v-text="'利用規約'" />
          </v-list-item-content>
        </v-list-item>
        <!-- プライバシーポリシー -->
        <v-list-item :to="'/privacy'" nuxt  dense>
          <v-list-item-content>
            <v-list-item-title v-text="'プライバシーポリシー'" />
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
  head: {
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap"
      }
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
      console.log(this.user)
    } else {
      this.user = this.$store.state.login.user
      console.log(this.user)
    }
  },
  computed: {
    islogin() {
      return this.$store.state.login.user
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
}
</script>

<style>
.color {
  background: linear-gradient(20deg, #191414, #1d8842);
}
</style>