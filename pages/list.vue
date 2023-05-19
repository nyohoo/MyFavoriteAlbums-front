<template>
  <v-container fluid fill-height>
    <v-container fill-height>

            <!-- タブの定義 -->
      <v-tabs grow>
        <v-tab
        v-for="title in titles"
        :key="title.id"
        >
          <p class="text-subtitle-1 text-font-weight-bold mb-1">{{ title.name }}</p>
        </v-tab>

        <!-- 最近の投稿一覧のタブ -->
        <v-tab-item class="tab-color">
          <v-row justify="center" class="justify-center">
            <v-col cols="12" xs="12" sm="8" md="6" lg="5">
              <div v-for="(post, index) in posts" :key="post.id">
                <!-- post内容表示のためのにカードで大枠 -->
                <v-hover v-slot:default="{ hover }">
                  <v-card elevation="1" class="mt-5 mb-9 pt-6 fadeDown" hover rounded-lg nuxt
                    :href="`/details/${post.post_uuid}`" :class="hover ? 'list-transparent' : ''">
                    <!-- postの画像表示のためカードで枠組み -->
                    <v-card tile flat class="mx-4">
                      <v-img :src="post.image_path" :lazy-src="post.image_path" aspect-ratio="1">
                        <!-- ローディング中の処理 -->
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </v-card>
                    <v-card-text>
                      <p class="text-subtitle-1 text-center mb-1">{{ post.user.name }}さんの</p>
                      <p class="text-h6 text-center mb-1">{{ post.hash_tag }}</p>
                      <p class="text-subtitle-2 text-center mt-5 mb-0">{{ post.created_at }}</p>
                    </v-card-text>
                    <!-- いいねボタン -->
                    <!-- 非ログインユーザーの表示 -->
                    <!--ログイン後にいいねできる旨をツールチップで説明 -->
                    <v-tooltip 
                      v-if="currentUser.uid == null"
                      v-model="isLikeTooltip[index]"
                      top 
                      >
                      <template #activator="{ on }">
                        <v-btn 
                          v-on="on"
                          color="blue-grey darken-1" 
                          height="75px"
                          width="80px"
                          fab 
                          fixed 
                          bottom 
                          right
                          icon 
                          retain-focus-on-click 
                          class="mb-0 pb-0" 
                          style="bottom: -1px; right: 0px;"
                          @click.prevent="beforeLoginUserLikeTooltip(index)"
                        >
                          <v-icon>mdi-heart</v-icon>
                        </v-btn>
                      </template>
                      <span>ログイン後にいいね可能です</span>
                    </v-tooltip>

                    <div v-if="currentUser.uid != null && post.user.uid !== currentUser.uid">
                      <v-btn 
                        v-if="!currentUserLikes.includes(post.id)" 
                        color="blue-grey darken-1" 
                        height="75px"
                        width="80px"
                        fab 
                        fixed 
                        bottom 
                        right
                        icon 
                        retain-focus-on-click 
                        class="mb-0 pb-0" 
                        style="bottom: -1px; right: 0px;"
                        @click.prevent="addLike(post, index)">
                        <v-icon>mdi-heart-plus</v-icon>
                      </v-btn>

                      <v-tooltip 
                        v-if="currentUserLikes.includes(post.id)" 
                        top 
                        v-model="isLikeTooltip[index]"
                      >
                        <template #activator="{}">
                          <v-btn 
                            color="red" 
                            elevation-19 
                            height="75px"
                            width="80px"
                            fab 
                            fixed 
                            bottom 
                            right
                            retain-focus-on-click 
                            icon 
                            style="bottom: -1px; right: 0px;" 
                            class="mb-0 pb-0"
                            @click.prevent="deleteLike(post)">
                            <v-icon>mdi-heart</v-icon>
                          </v-btn>
                        </template>
                        <span>いいねしました</span>
                      </v-tooltip>
                    </div>
                  </v-card>
                </v-hover>
              </div>
              <!-- 無限スクロール -->
              <v-col>
                <infinite-loading @infinite="infiniteHandler">
                </infinite-loading>
              </v-col>
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- ランダム一覧のタブ -->
        <v-tab-item class="tab-color">
          <v-row justify="center" class="justify-center" v-if="random_post && random_post.user">
            <v-col cols="12" xs="12" sm="8" md="6" lg="5">
              <!-- 単一の投稿表示 -->
              <v-hover v-slot:default="{ hover }">
                <v-card elevation="1" class="mt-5 mb-1 pt-6 fadeDown" hover rounded-lg nuxt
                  :href="`/details/${random_post.post_uuid}`" :class="hover ? 'list-transparent' : ''">
                  <!-- postの画像表示のためカードで枠組み -->
                  <v-card tile flat class="mx-4">
                    <v-img :src="random_post.image_path" :lazy-src="random_post.image_path" aspect-ratio="1">
                      <!-- ローディング中の処理 -->
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-card>
                  <v-card-text>
                    <p class="text-subtitle-1 text-center mb-1">{{ random_post.user.name }}さんの</p>
                    <p class="text-h6 text-center mb-1">{{ random_post.hash_tag }}</p>
                    <p class="text-subtitle-2 text-center mt-5 mb-0">{{ random_post.created_at }}</p>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn color="primary" @click="fetchRandomPost" min-height="40px">別のランダム投稿をみる</v-btn>
            </v-col>
          </v-row>

        </v-tab-item>
      </v-tabs>

    </v-container>
  </v-container>
</template>

<script>
import { axios } from "@/plugins/axios";

export default {
  head() {
    return {
      title: "投稿一覧",
      meta: [
        {
          hid: 'description',
          name: "description",
          content: "みんなが作った「#私を構成する9枚」の一覧ページです。"
        }
      ]
    };
  },
  data() {
    return {
      currentUserLikes: [],
      posts: [],
      random_post: {},
      page: 1, //pageの値によってpagenationされたJSONを取ってくる
      isLikeTooltip: [],
      titles: [
        { id: 1, name: "最近の投稿"},
        { id: 2, name: "ランダム"}
      ],
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.login.user || {};
    },
  },
  mounted() {
    this.fetchCurrentUserLikes();
    this.fetchRandomPost();
  },
  methods: {
    async fetchCurrentUserLikes() {
      if (!this.currentUser) return;
      try {
        const response = await axios.get(`likes/${this.currentUser.uid}`);
        this.currentUserLikes = response.data.likes;
      } catch (error) {
        console.log(error);
      }
    },
    // 無限スクロールで5件ずつ取得
    async infiniteHandler($state) {
      try {
        const data = await axios.$get("posts/lists", {
          params: {
            page: this.page,
          },
        })
        //そのままだと読み込み時にカクつくので500毎に読み込む
        setTimeout(() => {
          if (this.page <= data.kaminari.pagenation.pages) {
            this.page += 1
            this.posts.push(...data.posts)
            $state.loaded()
          } else {
            $state.complete()
          }
        }, 500)
      } catch (error) {
        $state.complete()
      }
    },
    async addLike(post, index) {
      try {
        await axios.$post("likes", {
          id: post.id
        });
        this.isLikeTooltip[index] = true;
        console.log(this.isLikeTooltip);
        this.currentUserLikes.push(post.id);
      } catch (error) {
        console.log(error);
      } finally {
        // 1.5秒後にツールチップを閉じる
        setTimeout(() => {
          this.isLikeTooltip = [];
          console.log(this.isLikeTooltip);
        }, 1000);
      }
    },
    async deleteLike(post) {
      await axios.$delete("likes/" + post.id);
      // currentUserLikesから削除
      this.currentUserLikes = this.currentUserLikes.filter(like => like !== post.id);
    },
    beforeLoginUserLikeTooltip(index) {
      this.isLikeTooltip[index] = true;
      // 1.5秒後にツールチップを閉じる
      setTimeout(() => {
        this.isLikeTooltip = [];
        console.log(this.isLikeTooltip);
      } , 1000);
    },
    async fetchRandomPost() {
      try {
        const response = await axios.get("posts/random");
        this.random_post = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
}
</script>

<style>
.list-transparent {
  background-color: rgba(110, 159, 130, 0.17) !important;
  opacity: 0.91;
  border-color: transparent !important;
}

.fadeDown {
  animation-name: fadeDownAnime;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  opacity: 0.3;
}

@keyframes fadeDownAnime {
  from {
    opacity: 0.1;
    transform: translateY(-17px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-color {
  background-color: #121212 !important;
}
</style>