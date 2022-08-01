<template>
  <v-container fluid fill-height>
    <!-- userのプロフィールを表示する -->
    <v-container fill-height>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-avatar size="100px" class="mx-auto">
            <img :src="response.user.image" />
          </v-avatar>
          <p class="text-h6 font-weight-bold">
            {{ response.user.name }}さんの投稿一覧
          </p>
        </v-col>
      </v-row>
    </v-container>

    <v-container fill-height>
      <v-row justify="center">
        <v-col cols="12" sm="4" md="4">
          <div v-for="post in response.posts" :key="post.id">
            <!-- post内容表示のためのにカードで大枠 -->
            <v-hover v-slot:default="{ hover }">
              <v-card class="mt-5 mb-9" 
                hover rounded nuxt 
                :href="`/details/${post.post_uuid}`"
                :class="hover ? 'user-transparent' : ''"
              >
                <!-- postの画像表示のためカードで枠組み -->
                <v-card tile flat>
                  <v-img :src="post.image_path" :lazy-src="post.image_path" aspect-ratio="1">
                    <!-- ローディング中の処理 -->ï
                    <template v-slot:placïeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-card>
                <v-card-text>
                  <p class="headline text-center mb-1">{{ post.hash_tag }}</p>
                  <p class="subtitle text-center mb-1">{{ post.created_at }}</p>
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
    const data = await axios.$get("/api/v1/users/" + context.params.id);
    return { response: data };
  },
  // head() {
  //   return {
  //     // title: this.user.name + "さんの " + this.post.hash_tag,
  //     titleTemplate: "",
  //   };
  // },
}
</script>

<style>
.user-transparent {
  background-color: rgba(110, 159, 130, 0.17) !important;
  opacity: 0.91;
  border-color: transparent !important;
}
</style>