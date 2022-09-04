<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-container mt-6 mb-8>
          <!-- （ユーザー名）の（ハッシュタグ名）の形でヘッドタイトル作成-->
          <!-- ユーザー名 -->
          <v-row algin="center" justify="center">
            <div align="left">
              <p class="text-h6">
                <v-hover v-slot:default="{ hover }">
                  <nuxt-link :to="`/users/${post.user.uid}`" :style="{ 'color': hover ? '#00C853' : '#43A047' }">
                    {{ post.user.name }}
                  </nuxt-link>
                </v-hover>
              </p>
            </div>
            <p class="text-h6" align="left">さんの</p>
          </v-row>
          <!-- ハッシュタグ名 -->
          <v-row algin="center" justify="center" class="mt-0 mb-5">
            <div v-text="post.hash_tag" class="text-h5" />
          </v-row>

          <!-- spotifyのアルバム情報から9枚を描画し、メインイメージとして表示 -->
          <v-row justify="center">
            <v-col cols="12" sm="6" md="6">
              <v-card justify="center" class="fadeUp">
                <v-container>
                  <v-row>
                    <v-col v-for="album in post.albums" :key="album.id" class="d-flex child-flex ma-0 pa-0" cols="4">
                      <v-hover v-slot:default="{ hover }">
                        <!-- アルバム画像の表示 -->
                        <v-card :class="hover ? 'detail-transparent' : ''" tile flat class="mx-auto">
                          <v-img :src="album.images[0].url" :lazy-src="album.images[0].url" :alt="album.name"
                            aspect-ratio="1" class="my-0 rounded-0" :style="{ 'cursor': hover ? 'pointer' : 'default' }"
                            @click="openAlbumIframe(album)">
                            <!-- ローディング中の処理 -->
                            <template v-slot:placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                              </v-row>
                            </template>
                          </v-img>
                        </v-card>
                      </v-hover>
                    </v-col>
                    <!-- iframeの呼び出し -->
                    <Iframe :isIframe="iframe" :spotifyId="spotifyId" :embedType="embedType"
                      @closeDialog="iframe = false, embedType = ''" />
                  </v-row>
                </v-container>
              </v-card>

              <!-- ログイン中の場合はツイートボタンと削除ボタンを表示する -->
              <v-col v-if="post.user.uid === user.uid" class="d-flex justify-center pt-5">
                <!-- Twitter共有ボタン -->
                <v-btn class="mx-2" width="80px" color="blue darken-1" style="text-transform: none;" rounded @click="openTwitterCard">
                  <v-icon>mdi-twitter</v-icon>
                </v-btn>
                <TwitterShare :isTwitterCardDialog="isTwitterCardDialog" :post="post" @resetForm="isTwitterCardDialog = false" />

                <!-- 投稿削除ボタン -->
                <v-btn class="mx-2" width="80px" color="red darken-1" style="text-transform: none;" rounded @click="openConfirm">
                  <v-icon>mdi-trash-can</v-icon>
                </v-btn>
                <ConfirmDialog :isConfirmDialog="isConfirmDialog" :postUuid="post.post_uuid" :userUid="user.uid" @closeDialog="isConfirmDialog = false" />
              </v-col>
            </v-col>
          </v-row>
        </v-container>

        <!-- 各アルバムの情報を表示する -->
        <v-container justify="center" pa-0 pl-1>
          <v-row justify="center">
            <v-col cols="12" sm="6" justify="center">
              <v-list nav>
                <template v-for="(album, index) in post.albums">
                  <v-list-item dense>
                    <v-list-item-avatar tile height="41%" width="41%" class="mx-0 px-0">
                      <v-hover v-slot:default="{ hover }">
                        <v-card :class="hover ? 'detail-transparent' : ''" flat tile>
                          <v-img :src="album.images[0].url" :class="{ 'pointer': hover }"
                            :style="{ 'cursor': hover ? 'pointer' : 'default' }" @click="openAlbumIframe(album)" />
                        </v-card>
                      </v-hover>
                    </v-list-item-avatar>
                    <v-list-item-content class="sm-mt-1 mb-0 mt-0">
                      <v-list-item-title class="ml-0 mb-0 pl-4 wrap-text">
                        <v-hover v-slot="{ hover }">
                          <p class="text-body-3 font-weight-bold my-0 py-0 ml-1" :class="{ 'text-body-3': hover }"
                            :style="{ 'color': hover ? '#008000' : '' }" @click="openAlbumIframe(album)">
                            {{ album.name }}
                          </p>
                        </v-hover>
                      </v-list-item-title>
                      <span class="text-caption font-weight-thin pl-4 ml-1 pt-1 mb-1">
                        ({{ post.dates[index] }})
                      </span>
                      <v-list-item-title class="pl-4 ml-1 mt-2 mb-0 pb-0">
                        <v-hover v-slot="{ hover }">
                          <p class="text-caption font-weight-medium mb-0 pb-3" :class="{ 'text-caption': hover }"
                            :style="{ 'color': hover ? '#008000' : '' }" @click="openArtistIframe(album)">
                            {{ album.artists[0].name }}
                          </p>
                        </v-hover>
                      </v-list-item-title>

                      <!-- ブックマークボタン -->
                      <v-list-item-action  class="sm-mb-1 pl-2 mt-2">
                        <v-row>
                          <!-- 非ログインユーザー -->
                          <div v-if="user.uid == null">
                            <!--ログイン後にブックマークできる旨をツールチップで説明 -->
                            <v-tooltip 
                              top
                            >
                              <template #activator="{ on }">
                                <v-btn 
                                  v-on="on" 
                                  @click="beforeLoginUserBookmarkTooltip"
                                  fab 
                                  small 
                                  icon 
                                  height="40px" 
                                  width="40px"
                                >
                                  <v-icon>mdi-bookmark</v-icon>
                                </v-btn>
                              </template>
                              <span>ログイン後に「あとで聴く」へ追加できます</span>
                            </v-tooltip>
                          </div>
                          <!-- ログインユーザー && 投稿の非作成者はブックマーク可能とする -->
                          <div v-if="user.uid != null && post.user.uid !== user.uid">
                            <!-- albumをブックマーク済みか確認 -->
                            <v-btn
                              v-if="!currentUserBookmarks.includes(album.id)"
                              small
                              fab 
                              icon 
                              height="35px" 
                              width="35px" 
                              @click="addBookmark(album, index)"
                            >
                              <v-icon>mdi-bookmark-outline</v-icon>
                            </v-btn>
                            <v-tooltip top 
                              v-else
                              v-model="isBookmarkTooltip[index]"
                            >
                              <template #activator="{ attrs }">
                                <v-btn
                                  v-bind="attrs"
                                  color="blue"
                                  small
                                  fab 
                                  icon 
                                  height="35px" 
                                  width="35px" 
                                  @click="deleteBookmark(album)"
                                >
                                  <v-icon>mdi-bookmark</v-icon>
                                </v-btn>
                                </template>
                              <span>「あとで聴く」に追加しました</span>
                              </v-tooltip>
                          </div>

                          <v-tooltip top v-if="user.uid != null && post.user.uid === user.uid">
                            <template #activator="{ on }">
                              <v-btn 
                                fab 
                                icon 
                                small
                                height="33px" 
                                width="34px">
                                <v-icon v-on="on">mdi-comment-processing-outline</v-icon>
                              </v-btn>
                            </template>
                            <span>コメント機能を追加予定です。</span>
                          </v-tooltip>
                        </v-row>
                      </v-list-item-action>
                    </v-list-item-content>
                  </v-list-item>
                  <v-row class="pl-4 mt-1 mb-1 mr-0 ">
                    <div id="songlink">
                      <iframe :src="`https://embed.odesli.co/?url=spotify:album:${album.id}&theme=dark`" frameborder="0"
                        allowtransparency allowfullscreen
                        sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox">
                      </iframe>
                    </div>
                  </v-row>
                  <v-divider v-if="index !== 8" class="mt-5 mb-3 mx-4"></v-divider>
                </template>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <!-- いいねボタン -->
    <!-- 非ログインユーザーの表示 -->
    <v-row v-if="user.uid == null" justify="center">
      <v-col cols="1" offset="8" offset-sm="7" offset-md="7" offset-lg="7">
        <!--ログイン後にいいねできる旨をツールチップで説明 -->
        <v-tooltip 
          v-model="isLikeTooltip"
          top
        >
          <template #activator="{ on }">
            <v-btn
              color="blue-grey darken-4"
              v-on="on"
              fab
              fixed
              bottom
              depressed
              class="mb-9"
              @click="beforeLoginUserLikeTooltip"
            >
              <v-icon>mdi-heart</v-icon>
            </v-btn>
          </template>
          <span>ログイン後にいいね可能です</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <!-- ログインしている場合はいいね機能 -->
    <div v-else>
      <v-row v-if="post.user.uid !== user.uid" justify="center">
        <v-col cols="1" offset="8" offset-sm="7" offset-md="7" offset-lg="7">
          <!--ツールチップで説明 -->
          <v-tooltip 
            v-if="!post.likes.find(like => like.user_id === user.id)"
            top
            v-model="isLikeTooltip"
            >
            <template #activator="{}">
              <v-btn
                color="blue-grey darken-4"
                fab
                fixed
                bottom
                retain-focus-on-click
                depressed
                class="mb-9"
                @click="addLike"
              >
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </template>
            <span>いいねしました</span>
          </v-tooltip>
            <v-btn
              v-if="post.likes.find(like => like.user_id === user.id) || isLikeButton"
              color="red"
              fab
              fixed
              bottom
              retain-focus-on-click
              depressed
              class="mb-9"
              @click="deleteLike"
            >
              <v-icon>mdi-heart</v-icon>
            </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { axios } from "@/plugins/axios";
import Iframe from '@/components/Iframe.vue'

import ConfirmDialog from '@/components/ConfirmDialog.vue'
import TwitterShare from "../../components/TwitterShare.vue";

export default {
  async asyncData(context) {
    const data = await axios.$get("posts/" + context.params.id);
    return { 
      post: data,
      currentUserBookmarks: data.currentUserBookmarks,
    };
  },
  head() {
    return {
      title: this.post.user.name + "さんの " + this.post.hash_tag,
      titleTemplate: "",
      meta: [
      { hid: 'description', name: 'description', content: this.post.user.name + 'さんの' + this.post.hash_tag + 'です。選んだ9枚のアルバムの詳細情報がみれます。' }
      ],
    };
  },
  components: {
    Iframe,
    ConfirmDialog,
    TwitterShare
},
  data() {
    return {
      // loading: true,
      iframe: false,
      detail: false,
      embedType: "",
      spotifyId: "",
      isConfirmDialog: false,
      isTwitterCardDialog: false,
      isLikeButton: false,
      isLikeTooltip: false,
      isBookmarkTooltip: [],
    };
  },
  computed: {
    user() {
      // ユーザー情報がない場合は空で返す
      return this.$store.state.login.user || {};
    },
  },
  destroyed() {
    this.isLikeButton = false;
  },
  methods: {
    openAlbumIframe({ id }) {
      this.iframe = true;
      this.detail = true;
      this.embedType = "album";
      this.spotifyId = id;
    },
    openArtistIframe(album) {
      this.iframe = true;
      this.detail = true;
      this.embedType = "artist";
      this.spotifyId = album.artists[0].id;
    },
    isLoginUserPost() {
      if (this.post.user.uid === this.$store.state.login.user.uid) {
        return true;
      } else {
        return false;
      };
    },
    openConfirm() {
      this.isConfirmDialog = true;
    },
    openTwitterCard() {
      this.isTwitterCardDialog = true;
    },
    async addLike() {
      try {
        await axios.$post("likes", {
          id: this.post.id
        });
        this.isLikeTooltip = true;
        this.isLikeButton = true;
      } catch (error) {
        console.log(error);
      } finally {
        // 1.5秒後にツールチップを閉じる
        setTimeout(() => {
          this.isLikeTooltip = false;
        }, 1000);
      }
    },
    async deleteLike() {
      await axios.$delete("likes/" + this.post.id);
      // ページリロードまでの間、likeを消す
      this.post.likes = this.post.likes.filter(like => like.user_id !== this.user.id);
      this.isLikeButton = false;
    },
    async addBookmark(album, index) {
      try {
        await axios.$post("bookmarks", {
          id: album.id
        });
        // ツールチップをv-forの中で使うためにindexを渡す
        this.isBookmarkTooltip[index] = true;
        // ブックマークした時に自分のブックマーク一覧にspotify_album_idが追加される
        this.currentUserBookmarks = [...this.currentUserBookmarks, album.id];
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          this.isBookmarkTooltip = [];
        }, 1500);
      }
    },
    async deleteBookmark(album) {
      await axios.$delete("bookmarks/" + album.id);
      this.currentUserBookmarks = [...this.currentUserBookmarks.filter(id => id !== album.id)];
    },
    beforeLoginUserLikeTooltip() {
      this.isLikeTooltip = true;
      // 1.5秒後にツールチップを閉じる
      setTimeout(() => {
        this.isLikeTooltip = false;
        console.log(this.isLikeTooltip);
      } , 1000);
    },
    beforeLoginUserBookmarkTooltip() {
      this.isBookmarkTooltip = true;
      // 1.5秒後にツールチップを閉じる
      setTimeout(() => {
        this.isBookmarkTooltip = [];
        console.log(this.isBookmarkTooltip);
      } , 1000);
    },
  },
};
</script>

<style>
.wrap-text {
  word-break: break-all;
  white-space: normal;
}

#songlink {
  width: 105%;
  height: 43px;
  overflow: hidden;
}

#songlink iframe {
  width: 116%;
  height: 43px;
  margin-left: -56px;
}

.detail-transparent {
  opacity: 0.85;
  border-color: transparent !important;
}
</style>