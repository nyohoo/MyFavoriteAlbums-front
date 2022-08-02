<template>
  <v-container fluid fill-height>
    <v-container fill-height>

      <v-row algin="center" justify="center">
        <v-card rounded="xl" color="rgba(27, 79, 45, 0.6)">
          <v-card-title>
            <span class="font-weight-bold headline" color="#F5F5F5" >最近の投稿一覧</span>
          </v-card-title>
        </v-card>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" xs="8" sm="8" md="6">
          <div v-for="post in posts" :key="post.id">

            <!-- post内容表示のためのにカードで大枠 -->
            <v-hover v-slot:default="{ hover }">
              <v-card class="mt-5 mb-9 mx-8" hover rounded nuxt :href="`/details/${post.post_uuid}`"
                :class="hover ? 'list-transparent' : ''">
                
                <!-- postの画像表示のためカードで枠組み -->
                <v-card tile flat>
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
                  <p class="headline text-center mb-1">{{ post.user.name}}さんの</p>
                  <p class="headline text-center mb-1">{{ post.hash_tag }}</p>
                  <p class="subtitle text-center mb-1">{{ post.created_at }}</p>
                </v-card-text>

              </v-card>
            </v-hover>
          </div>

          <!-- 無限スクロール -->
          <infinite-loading @infinite="infiniteHandler">
          </infinite-loading>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { axios } from "@/plugins/axios";

export default {
  data() {
    return {
      posts: [],
      page: 1, //このpageの値によってpagenationされたJSONを取ってきます
    }
  },
  methods: {
    // 無限スクロールで5件ずつ取得
    async infiniteHandler($state) {
      try {
        const data = await axios.$get("/api/v1/posts/lists", {
          params: {
            page: this.page,
          },
        })
        //そのままだと読み込み時にカクつくので1500毎に読み込む
        setTimeout(() => {
          if (this.page <= data.kaminari.pagenation.pages) {
            this.page += 1
            this.posts.push(...data.posts)
            $state.loaded()
          } else {
            $state.complete()
          }
        }, 1500)
      } catch (error) {
        $state.complete()
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
</style>