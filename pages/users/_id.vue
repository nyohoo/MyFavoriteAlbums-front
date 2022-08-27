<template>
  <v-container fluid fill-height class="mx-0">
    <!-- userのプロフィールを表示する -->
    <v-container fill-height>
      <v-row>
        <v-col cols="12" class="text-center">
          <!-- アバター画像をクリックするとツイッターのプロフィールに遷移 -->
          <v-avatar size="100px" class="mx-auto" @click:push="`https://twitter.com/${post.user.twitter_id}`">
            <img :src="user.image" />
          </v-avatar>
          <v-hover v-slot:default="{ hover }">
            <p class="text-h6 font-weight-bold mt-2">
              <a :href="`https://twitter.com/${user.nickname}`"
                :style="{ 'color': hover ? '#00C853' : '#43A047' }">
                {{ user.name }}
              </a>
              さん
            </p>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>

    <!-- タブで投稿一覧・いいね一覧を切り替え -->
    <v-tabs
      grow
      background-color="#121212">
      <v-tab
        v-for="title in titles"
        :key="title.id"
      >
        <p class="text-subtitle-1 text-font-weight-bold mb-1">{{ title.name }}</p>
      </v-tab>
      

      <v-tab-item class="tab-color">
        <v-container fill-height v-if="posts.length === 0">
          <v-row justify="center" class="mt-16 pb-16 mb-16">
            <p class="text-subtitle-1">
              9枚の画像を選んで作成すると
            </p>
            <p class="text-subtitle-1">
              投稿が表示されます。
            </p>
          </v-row>
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
        </v-container>

        <v-container v-else>
          <!-- ユーザーが投稿したpost一覧を表示する -->
          <UserPostsPage ref="post" :posts="posts" :user="user" @addPosts="addPosts" />
        </v-container>
      </v-tab-item>

      <!-- いいねタブ -->
      <v-tab-item class="tab-color">
        <v-container fill-height v-if="likes.length === 0">
          <v-row justify="center" class="mt-16">
            <p class="text-subtitle-1">
              いいねした投稿はありません。
            </p>
          </v-row>
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
        </v-container>

        <v-container fill-height v-else>
          <!-- ユーザーのいいねを表示する -->
          <UserLikesPage ref="like" :likes="likes" :user="user" @addLikes="addLikes" />
        </v-container>
      </v-tab-item>

      <!-- ブックマーク -->
      <v-tab-item class="tab-color">
        <v-container fill-height v-if="bookmarks == 0">
          <v-row justify="center" class="mt-16">
            <p class="text-subtitle-1">
              あとで聴くに入れたアルバムが
            </p>
            <p class="text-subtitle-1">
              ありません。
            </p>
          </v-row>
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
        </v-container>

        <v-container fill-height v-else>
          <!-- ユーザーのいいねを表示する -->
          <UserBookmarksPage ref="bookmark" 
            :bookmarks="bookmarks" 
            :user="user" 
            :currentUser="currentUser" 
            :currentUserBookmark="currentUserBookmark" 
            @fetchMoreBookmarks="fetchMoreBookmarks" 
            @addCurrentUserBookmark="addCurrentUserBookmark"
            @removeCurrentUserBookmark="removeCurrentUserBookmark"
            />
        </v-container>
      </v-tab-item>

    </v-tabs>
  </v-container>
</template>

<script>
import { axios } from "@/plugins/axios";
import UserPostsPage from "@/components/UserPostsPage.vue";
import UserLikesPage from "@/components/UserLikesPage.vue";

export default {
  async asyncData(context) {
    // users/:uid/posts/と、users/:uid/likes/を同時に非同期で処理するため、以下の書き方となっている
    const results = [];
    const urls = [`users/${context.params.id}`,
                  `users/${context.params.id}/posts`,
                  `users/${context.params.id}/likes`,
                  `users/${context.params.id}/bookmarks`,
                  ];

    for (const url of urls) {
      const response = await axios.get(url, {
        params: {
          page: 1,
        }
      });
      results.push(response.data);
    }

    return {
      user: results[0].user,
      posts: results[1],
      likes: results[2].likes,
      bookmarks: results[3].bookmarks,
    };
  },
  head() {
    return {
      title: this.user.name + "さんのマイページ",
      titleTemplate: "",
      meta: [
      { hid: 'description', name: 'description', content: this.user.name + 'さんのマイページです。投稿・いいね・ブックマークなどがみれます。' }
      ],
    };
  },
  data() {
    return {
      user: {},
      currentUserBookmark: [],
      posts: [],
      likes: [],
      titles: [
        { id: 1, name: "投稿"},
        { id: 2, name: "いいね"},
        { id: 3, name: "あとで聴く"},
      ],
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.login.user || {};
    },
  },
  mounted() {
    this.fetchCurrentUserBookmark();
  },
  components: {
    UserPostsPage,
    UserLikesPage,
  },
  methods: {
    async fetchCurrentUserBookmark() {
      if (!this.currentUser) return;
      try {
        const response = await axios.get(`bookmarks/${this.currentUser.uid}`);
        this.currentUserBookmark = response.data.bookmarks;
      } catch (error) {
        console.log(error);
      }
    },
    addPosts(newPosts) {
      this.posts = [...this.posts, ...newPosts];
    },
    addLikes(newLikes) {
      this.likes = [...this.likes, ...newLikes];
    },
    fetchMoreBookmarks(newBookmarks) {
      this.bookmarks = [...this.bookmarks, ...newBookmarks];
    },
    addCurrentUserBookmark(newBookmark) {
      this.currentUserBookmark = [...this.currentUserBookmark, newBookmark];
    },
    removeCurrentUserBookmark(removeBookmark) {
      this.currentUserBookmark = this.currentUserBookmark.filter(bookmark => bookmark !== removeBookmark);
    },
  },
}
</script>

<style>
.user-transparent {
  background-color: rgba(110, 159, 130, 0.17) !important;
  opacity: 0.91;
  border-color: transparent !important;
}

.tab-color {
  background-color: #121212 !important;
}
</style>