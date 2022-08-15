<template>
  <v-container fluid fill-height>
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
      fixed-tabs
      background-color="#121212">
      <v-tab
        v-for="title in titles"
        :key="title.id"
      >
        <p class="text-subtitle-1 text-font-weight-bold mb-1">{{ title.name }}</p>
      </v-tab>
      

      <v-tab-item class="tab-color">
        <v-container fill-height v-if="!posts">
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
          <v-spacer />
        </v-container>

        <v-container v-else>
          <!-- ユーザーが投稿したpost一覧を表示する -->
          <UserPostsPage ref="post" :posts="posts" :user="user" @addPosts="addPosts" />
        </v-container>
      </v-tab-item>

      <!-- いいねタブ -->
      <v-tab-item class="tab-color">
        <v-container fill-height v-if="!likes">
          <v-row justify="center" class="mt-16">
            <p class="text-subtitle-1">
              {{ user.name }} さんの
            </p>
            <p class="text-subtitle-1">
              いいねした投稿はありません。
            </p>
          </v-row>
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
          <v-row class="mt-16 pt-16" />
        </v-container>

        <v-container fill-height v-if="likes">
          <!-- ユーザーのいいねを表示する -->
          <UserLikesPage ref="like" :likes="likes" :user="user" @addLikes="addLikes" />
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
    const urls = [`users/${context.params.id}/posts`, `users/${context.params.id}/likes`];

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
      posts: results[0].posts,
      likes: results[1].likes,
    };
  },
  head() {
    return {
      title: this.user.name + "さんのマイページ",
      titleTemplate: "",
    };
  },
  data() {
    return {
      user: {},
      posts: [],
      likes: [],
      titles: [
        { id: 1, name: "投稿"},
        { id: 2, name: "いいね"},
      ],
    };
  },
  components: {
    UserPostsPage,
    UserLikesPage,
  },
  methods: {
    // 無限スクロールでロードを検知するとユーザーの投稿一覧を取得する
    async fetchPosts(newPostAskedPage) {
      const { data: newPosts } = await axios.get(`users/${this.user.uid}/posts`, {
        params: {
          page: newPostAskedPage,
        },
      });
      if (newPosts.length) {
        this.posts = [...this.posts, ...newPosts];
        this.$refs.post.$refs.infiniteLoader.stateChanger.loaded();
      } else {
        this.$refs.post.$refs.infiniteLoader.stateChanger.complete();
      }
    },
    addPosts(newPosts) {
      this.posts = [...this.posts, ...newPosts];
    },
    addLikes(newLikes) {
      this.likes = [...this.likes, ...newLikes];
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