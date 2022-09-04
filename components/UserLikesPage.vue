<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" md="7" lg="5">
      <div v-for="(like, index) in likes" :key="like.id">
        <v-hover v-slot:default="{ hover }">
          <v-card class="mt-5 mb-9 pt-3 px-2 fadeUp" hover rounded nuxt :href="`/details/${like.uuid}`"
            :class="hover ? 'user-transparent' : ''">
            <!-- postの画像表示のためカードで枠組み -->
            <v-container class="pb-0">
              <v-card tile flat>
                <!-- likeに紐づくidと一致するpostの画像を表示 -->
                <v-img :src="like.imagePath" :lazy-src="like.imagePath" aspect-ratio="1">
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
              <p class="text-subtitle-1 text-center mb-1">{{ like.user.name }}さんの</p>
              <p class="text-h6 text-center mb-1">{{ like.hashTag }}</p>
              <p class="text-subtitle-2 text-center mb-1">{{ like.createdAt }}</p>
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

            <div v-if="currentUser.uid != null && like.user.uid !== currentUser.uid">
              <v-btn 
                v-if="!currentUserLikes.includes(like.id)" 
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
                @click.prevent="addLike(like, index)">
                <v-icon>mdi-heart-plus</v-icon>
              </v-btn>

              <v-tooltip 
                v-if="currentUserLikes.includes(like.id)" 
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
                    @click.prevent="deleteLike(like)">
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                </template>
                <span>いいねしました</span>
              </v-tooltip>
            </div>

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
    likes: {
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
      currentUserLikes: [],
      isLikeTooltip: [],
      page: 1,
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.login.user || {};
    },
  },
  mounted() {
    this.fetchCurrentUserLikes();
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
    async addLike(like, index) {
      try {
        await axios.$post("likes", {
          id: like.id
        });
        this.isLikeTooltip[index] = true;
        console.log(this.isLikeTooltip[index]);
        this.currentUserLikes.push(like.id);
      } catch (error) {
        console.log(error);
      } finally {
        // 1.5秒後にツールチップを閉じる
        setTimeout(() => {
          this.isLikeTooltip = [];
          console.log(this.isLikeTooltip);
        }, 1200);
      }
    },
    async deleteLike(like) {
      await axios.$delete("likes/" + like.id);
      // currentUserLikesからlike.idと一致するものを除外
      this.currentUserLikes = this.currentUserLikes.filter((id) => id !== like.id);
    },
    beforeLoginUserLikeTooltip(index) {
      this.isLikeTooltip[index] = true;
      // 1.5秒後にツールチップを閉じる
      setTimeout(() => {
        this.isLikeTooltip = [];
        console.log(this.isLikeTooltip);
      } , 500);
    },
    async infiniteHandler($state) {
      try {
        this.page += 1;
        const data = await axios.get(`users/${this.user.uid}/likes`, {
          params: {
            page: this.page,
          },
        });
        setTimeout(() => {
          if (data.data.length) {
            this.addLikes(data.data);
            $state.loaded();
          } else {
            $state.complete();
          }
        }, 500);
      } catch (error) {
        $state.complete();
      }
    },
    addLikes(newLikes) {
      this.$emit('addLikes', newLikes);
    },
  },
}
</script>