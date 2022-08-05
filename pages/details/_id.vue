<template>
  <v-container >
    <v-container mt-6 mb-13>
      <!-- （ユーザー名）の（ハッシュタグ名）の形でヘッドタイトル作成-->
      <v-row algin="center" justify="center">
        <div align="left">
          <p class="text-h6">
            <v-hover v-slot:default="{ hover }">
            <nuxt-link :to="`/users/${post.user.uid}`"
            :style="{ 'color': hover ? '#00C853' : '#43A047' }"
          >
              {{ post.user.name }}
            </nuxt-link>
            </v-hover>
          </p>
        </div>
        <p class="text-h6" align="left">さんの</p>
      </v-row>
      <v-row algin="center" justify="center" class="mt-0 mb-5">
        <div v-text="post.hash_tag" class="headline" />
      </v-row>
      <!-- spotifyのアルバム情報から9枚を描画し、メインイメージとして表示 -->
      <v-row justify="center">
        <v-col cols="12" sm="6" md="6">
        <v-card justify="center">
          <v-container>
            <v-row>
              <v-col v-for="album in post.albums" :key="album.id" class="d-flex child-flex ma-0 pa-0" cols="4">
                <v-hover v-slot:default="{ hover }">
                  <!-- アルバム画像の表示 -->
                  <v-card :class="hover ? 'detail-transparent' : ''" tile flat class="mx-auto">
                    <v-img :src="album.images[0].url" :lazy-src="album.images[0].url" :alt="album.name" aspect-ratio="1"
                      class="my-0 rounded-0" :style="{ 'cursor': hover ? 'pointer' : 'default' }"
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
        </v-col>
      </v-row>
    </v-container>


    <v-container justify="center" pa-0 pl-1>
      <v-row justify="center">
        <v-col cols="12" sm="6" justify="center">
          <v-list nav rounded>
            <template v-for="(album, index) in post.albums">
              <v-list-item dense>
                <v-list-item-avatar tile height="42%" width="42%" class="ml-0 pl-0">
                  <v-hover v-slot:default="{ hover }">
                    <v-card :class="hover ? 'detail-transparent' : ''" flat tile>
                      <v-img :src="album.images[0].url" :class="{ 'pointer': hover }"
                        :style="{ 'cursor': hover ? 'pointer' : 'default' }" @click="openAlbumIframe(album)" />
                    </v-card>
                  </v-hover>
                </v-list-item-avatar>
                <v-list-item-content class="my-0">
                  <v-list-item-title class="ml-0 my-0 py-0 wrap-text">
                    <v-hover v-slot="{ hover }">
                      <p class="text-body-2 font-weight-bold my-0 py-0 ml-1" :class="{ 'text-body-2': hover }"
                        :style="{ 'color': hover ? '#008000' : '' }" @click="openAlbumIframe(album)">
                        {{ album.name }}
                      </p>
                    </v-hover>
                  </v-list-item-title>
                  <span class="text-caption font-weight-thin ml-1 pt-1">
                    ({{ post.dates[index] }})
                  </span>
                  <v-list-item-title class="ml-1 mt-3">
                    <v-hover v-slot="{ hover }">
                      <p class="text-caption font-weight-medium wrap-text" :class="{ 'text-caption': hover }"
                        :style="{ 'color': hover ? '#008000' : '' }" @click="openArtistIframe(album)">
                        {{ album.artists[0].name }}
                      </p>
                    </v-hover>
                  </v-list-item-title>
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
  </v-container>
</template>

<script>
import { axios } from "@/plugins/axios";
import Iframe from '@/components/Iframe.vue'

export default {
  async asyncData(context) {
    const data = await axios.$get("posts/" + context.params.id);
    return { post: data };
  },
  head() {
    return {
      title: this.post.user.name + "さんの " + this.post.hash_tag,
      titleTemplate: "",
    };
  },
  components: {
    Iframe,
  },
  data() {
    return {
      // loading: true,
      iframe: false,
      detail: false,
      embedType: "",
      spotifyId: "",
    };
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
  height: 35px;
  overflow: hidden;
}

#songlink iframe {
  width: 116%;
  height: 35px;
  margin-left: -56px;
}

.detail-transparent {
  opacity: 0.85;
  border-color: transparent !important;
}
</style>