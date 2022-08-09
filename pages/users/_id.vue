<template>
  <v-container fluid fill-height>
    <!-- userのプロフィールを表示する -->
    <v-container fill-height>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-avatar size="100px" class="mx-auto">
            <img :src="response.user.image" />
          </v-avatar>
          <v-hover v-slot:default="{ hover }">
            <p class="text-h6 font-weight-bold mt-2">
              <a :href="`https://twitter.com/${response.user.nickname}`"
                :style="{ 'color': hover ? '#00C853' : '#43A047' }">
                {{ response.user.name }}
              </a>
              さんの投稿一覧
            </p>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>

    <v-container fill-height v-if="!response.posts">
      <v-row justify="center" class="mt-16">
        <p class="text-h6">
          9枚の画像を選んで作成すると
          ここに表示されます。
        </p>
      </v-row>
    </v-container>

    <v-container fill-height v-if="response.posts">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="7" lg="5">
          <div v-for="post in response.posts" :key="post.id">
            <!-- post内容表示のためのにカードで大枠 -->
            <v-hover v-slot:default="{ hover }">
              <v-card class="mt-5 mb-9 pt-3 px-2 fadeUp" hover rounded nuxt :href="`/details/${post.post_uuid}`"
                :class="hover ? 'user-transparent' : ''">
                <!-- postの画像表示のためカードで枠組み -->
                <v-container class="pb-0">
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
                </v-container>
                <v-card-text class="mt-0">
                  <p class="text-h6 text-center mb-1">{{ post.hash_tag }}</p>
                  <p class="text-subtitle-2 text-center mb-1">{{ post.created_at }}</p>
                </v-card-text>
              </v-card>
            </v-hover>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { axios } from "@/plugins/axios";

export default {
  async asyncData(context) {
    const data = await axios.$get("users/" + context.params.id);
    return { response: data };
  },
  head() {
    return {
      title: this.response.user.name + "さんのマイページ",
      titleTemplate: "",
    };
  },
}
</script>

<style>
.user-transparent {
  background-color: rgba(110, 159, 130, 0.17) !important;
  opacity: 0.91;
  border-color: transparent !important;
}
</style>