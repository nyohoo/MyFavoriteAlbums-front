<template>
  <v-dialog v-model="isTwitterCardDialog" persistent max-width="450px" max-height="350px" light>
    <v-card rounded="lg">
      <v-system-bar color="light-blue lighten-3" height="18%"></v-system-bar>  
        <!-- 画像のプレビュー -->
        <v-row justify="center" no-gutters>
          <v-col cols="12" sm="6" md="6" align="center">
            <v-card tile justify="center" width="63%" min-width="200px">
              <v-container mb-3 mt-4>
                <v-row>
                  <v-col v-for="album in post.albums" :key="album.id" class="d-flex child-flex ma-0 pa-0" cols="4">
                    <!-- アルバム画像の表示 -->
                    <v-card tile flat class="mx-auto">
                      <v-img :src="album.images[0].url" :lazy-src="album.images[0].url" :alt="album.name" aspect-ratio="1"
                        class="my-0 rounded-0">
                        <!-- ローディング中の処理 -->
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      <v-system-bar height="2%"></v-system-bar>  
      
      <v-card-text class="mt-1">
        <v-container>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-textarea v-model="tweetBody" :counter="117" label="本文" persistent-hint autofocus
              required hint="このページのURLが末尾に入ります" :rules="[rules.max]" />
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn rounded @click="resetForm">キャンセル</v-btn>
        <v-btn class="ml-4" color="light-blue accent-2" rounded :disabled="!valid" @click="sendTweetBody">ツイートする</v-btn>
      </v-card-actions>
    </v-card>
    <div>
      <Loading v-if="isLoading" :loading="isLoading" :isShareTwitter="isShareTwitterLoading" />
    </div>
  </v-dialog>
</template>

<script>
import { axios } from "@/plugins/axios";
import Loading from "@/components/Loading.vue"

export default {
  props: {
    post: {
      type: Object,
      default: () => ({}),
    },
    isTwitterCardDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      isShareTwitterLoading: false,
      valid: true,
      rules: {
        max: value => (value.length <= 117) || '117文字以内で入力してください',
      },
      tweetBody: "",
    };
  },
  component: {
    Loading,
  },
  mounted() {
    this.setForm();
  },
  methods: {
    async sendTweetBody() {
      if (!this.$refs.form.validate()) return;
      this.isLoading = true;
      this.isShareTwitterLoading = true;
      // tweets/createアクションに投稿内容を送信
      try {
        const data = await axios.$post("tweets", {
          post_uuid: this.post.post_uuid,
          text: this.tweetBody,
          url: window.location.href,
        })
        this.isLoading = false;
        this.isShareTwitterLoading = false;
        this.resetForm();
      } catch (error) {
        this.isLoading = false;
        this.isShareTwitterLoading = false;
      }
    },
    setForm() {
      this.tweetBody = this.post.hash_tag + "\n" + "\n" + "↓↓アルバム詳細はこちら↓↓";
    },
    resetForm() {
      this.$emit('resetForm');
    },
  }
}
</script>