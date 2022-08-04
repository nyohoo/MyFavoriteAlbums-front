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

    <v-navigation-drawer v-model="drawer" app bottom temporary right color="rgba(	29,136,66,0.5)">
      <v-list>
        <v-list-item :to="'/list'" router exact>
          <v-list-item-action >
            <v-icon>mdi-border-all</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'最近の投稿をみる'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/'" router exact>
          <v-list-item-action >
            <v-icon>mdi-apps</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'投稿作成'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/login'" router exact v-if="!islogin">
          <v-list-item-action >
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'ログイン'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="`/users/${user.uid}`" router exact v-else>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'マイページ'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/'" router exact v-if="!islogin">
          <v-list-item-action >
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'新規ユーザー登録'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/logout'" router exact v-else>
          <v-list-item-action >
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'ログアウト'" />
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
import { title } from 'process';

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