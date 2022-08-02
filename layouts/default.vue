<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list>
          <v-list-item>
            <v-btn icon @click.stop="miniVariant = !miniVariant">
              <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>

        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="theme" dense>
            </v-switch>
          </v-list-item-action>
          <v-icon left>
            mdi-brightness-4
          </v-icon>
          <v-list-item-title>Light / Dark</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="currentUser">
          <v-list-item-content>
            <nuxt-link :to="`/users/${currentUser.uid}`">
              <v-icon>mdi-account</v-icon>
              <v-list-item-title>マイページ</v-list-item-title>
            </nuxt-link>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <nuxt-link to="/list">
              <v-icon>mdi-post</v-icon>
              <v-list-item-title>>みんなの投稿</v-list-item-title>
            </nuxt-link>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app class="color" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      
      
      <!-- <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
        <v-toolbar-title v-show="isScroll">
          <v-icon dense>mdi-pound</v-icon>
          <span style="font-family: 'Oswald', sans-serif">{{ title }}</span>
        </v-toolbar-title>
      <v-spacer />
      <!-- <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item >
          <v-list-item-action>
            <v-switch v-model="theme">

            </v-switch>
          </v-list-item-action>
            <v-icon light>
            mdi-brightness-4
            </v-icon>
          <v-list-item-title>Light / Dark</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-footer :absolute="!fixed" app>
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
      scrollY: 0,
      isScroll: true,
      clipped: false,
      drawer: false,
      fixed: false,
      currentUser: {},
      theme: this.$store.state.thema.theme,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Top',
          to: '/'
        },
        {
          icon: 'mdi-account',
          title: 'Login',
          to: '/login'
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
          to: '/logout'
        }
      ],
      miniVariant: false,
      rightDrawer: false,
      right: true,
      title: 'MyFavoriteAlbums'
    }
  },
  beforeMount() {
    if (!this.$store.state.login.user) {
      this.currentUser = false
    } else {
      this.currentUser = this.$store.state.login.user
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  watch: {
    theme() {
      this.$store.dispatch("thema/theme", this.theme);
      this.$vuetify.theme.dark = this.theme;
    },
    scrollY() {
      if (scrollY > 10) {
        this.isScroll = false;
      } else {
        this.isScroll = true;
      }
    }
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY;
    },
  }

}
</script>

<style>
.color {
  background: linear-gradient(20deg, #191414, #1d8842);
}
</style>