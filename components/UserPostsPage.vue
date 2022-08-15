<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" md="7" lg="5">
      <div v-for="post in posts" :key="post.id">
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
        <infinite-loading
          @infinite="infiniteHandler"
        >
        <span slot="no-results"> </span>
        </infinite-loading>
    </v-col>
  </v-row>
</template>

<script>
import { axios } from '@/plugins/axios';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  components: {
    InfiniteLoading,
  },
  props: {
    posts: {
      type: Array,
      default: () => []
    },
    user: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      page: 1,
    }
  },
  methods: {
    async infiniteHandler($state) {
      try {
        this.page += 1;
        const data = await axios.get(`users/${this.user.uid}/posts`, {
          params: {
            page: this.page,
          },
        });
        setTimeout(() => {
          if (data['data']['posts'].length) {
            this.addPosts(data['data']['posts']);
            $state.loaded();
          } else {
            $state.complete();
          }
        }, 1000);
      } catch (error) {
        $state.complete();
      }
    },
    addPosts(newPosts) {
      this.$emit('addPosts', newPosts);
    },
  },
}
</script>