<template>
  <v-row justify="center" class="" no-gutters>
    <v-col cols="12">
      <v-container mt-6 mb-8>
        <v-row justify="center">
          <v-col cols="12" sm="8" class="ma-0 pa-0">
            <v-list>
              <template v-for="(bookmark, index) in bookmarks">
                <v-list-item>
                  <v-list-item-avatar tile height="39%" width="39%" class="mr-1">
                    <v-hover v-slot:default="{ hover }">
                      <v-card :class="hover ? 'detail-transparent' : ''" flat tile>
                        <v-img :src="bookmark.albumImagePath" :lazy-src="bookmark.albumImagePath" :class="{ 'pointer': hover }"
                          :style="{ 'cursor': hover ? 'pointer' : 'default' }" @click="openAlbumIframe(bookmark)" />
                      </v-card>
                    </v-hover>
                  </v-list-item-avatar>

                  <v-list-item-content class="sm-mt-1 mb-0 mt-0">
                    <v-list-item-title class="ml-0 mb-0 pl-2">
                      <v-hover v-slot="{ hover }">
                        <p class="text-body-3 font-weight-bold my-0 py-0 ml-1 wrap-text"
                          :class="{ 'text-body-3': hover }" :style="{ 'color': hover ? '#008000' : '' }"
                          @click="openAlbumIframe(bookmark)">
                          {{ bookmark.albumName }}
                        </p>
                      </v-hover>
                    </v-list-item-title>
                    <span class="text-caption font-weight-thin pl-1 ml-2 pt-1 mb-1">
                      {{ bookmark.albumReleaseDate }}
                    </span>
                    <v-list-item-title class="pl-1 ml-2 mt-2 mb-0 pb-0">
                      <v-hover v-slot="{ hover }">
                        <p class="text-caption font-weight-medium mb-0 pb-3" :class="{ 'text-caption': hover }"
                          :style="{ 'color': hover ? '#008000' : '' }" @click="openArtistIframe(bookmark)">
                          {{ bookmark.albumArtist }}
                        </p>
                      </v-hover>
                    </v-list-item-title>
                    <!-- ブックマーク・コメント閲覧ボタン -->
                    <v-list-item-action class="sm-mb-1 pl-0 mt-2">
                      <v-row>
                        <!-- ブックマークボタン -->
                        <!-- 非ログインユーザー -->
                        <div v-if="currentUser.uid == null">
                          <!--ログイン後にブックマークできる旨をツールチップで説明 -->
                          <v-tooltip top>
                            <template #activator="{ on }">
                              <v-btn v-on="on" fab small icon height="40px" width="40px">
                                <v-icon>mdi-bookmark</v-icon>
                              </v-btn>
                            </template>
                            <span>ログインして「あとで聴く」に追加</span>
                          </v-tooltip>
                        </div>
                        <!-- ログインユーザーはブックマーク可能 -->
                        <div v-if="currentUser.uid != null">
                          <!-- albumをブックマーク済みか確認 -->
                          <v-btn v-if="!currentUserBookmark.includes(bookmark.albumId)" small fab icon height="40px"
                            width="40px" @click="addBookmark(bookmark, index)">
                            <v-icon>mdi-bookmark-outline</v-icon>
                          </v-btn>

                          <v-tooltip top v-if="currentUserBookmark.includes(bookmark.albumId)"
                            v-model="isBookmarkTooltip[index]">
                            <template #activator="{ attrs }">
                              <v-btn v-bind="attrs" color="blue" small fab icon height="40px" width="40px"
                                @click="deleteBookmark(bookmark)">
                                <v-icon>mdi-bookmark</v-icon>
                              </v-btn>
                            </template>
                            <span>「あとで聴く」に追加しました</span>
                          </v-tooltip>
                        </div>
                      </v-row>
                    </v-list-item-action>
                  </v-list-item-content>
                </v-list-item>

                <v-row class="pl-6 mt-1 mb-1 mr-1 ">
                  <div id="songlink">
                    <iframe :src="`https://embed.odesli.co/?url=spotify:album:${bookmark.albumId}&theme=dark`"
                      frameborder="0" allowtransparency allowfullscreen
                      sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox">
                    </iframe>
                  </div>
                </v-row>

                <v-divider class="mt-5 mb-3 mx-4"></v-divider>
              </template>
              <infinite-loading @infinite="infiniteHandler">
                <span slot="no-results"> </span>
              </infinite-loading>
            </v-list>
          </v-col>
        </v-row>
        <Iframe :isIframe="iframe" :spotifyId="spotifyId" :embedType="embedType"
          @closeDialog="iframe = false, embedType = ''" />
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import { axios } from '@/plugins/axios';
import InfiniteLoading from 'vue-infinite-loading';
import Iframe from '@/components/Iframe.vue'

export default {
  components: {
    InfiniteLoading,
    Iframe
  },
  props: {
    bookmarks: {
      type: Array,
      default: () => []
    },
    currentUserBookmark: {
      type: Array,
      default: () => []
    },
    user: {
      type: Object,
      default: () => { }
    },
    currentUser: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      page: 1,
      iframe: false,
      spotifyId: '',
      embedType: '',
      isBookmarkTooltip: [],
    }
  },
  methods: {
    openAlbumIframe(bookmark) {
      this.iframe = true;
      this.detail = true;
      this.embedType = "album";
      this.spotifyId = bookmark.albumId;
    },
    openArtistIframe(bookmark) {
      this.iframe = true;
      this.detail = true;
      this.embedType = "artist";
      this.spotifyId = bookmark.artistId;
    },
    async infiniteHandler($state) {
      try {
        this.page += 1;
        const data = await axios.get(`users/${this.user.uid}/bookmarks`, {
          params: {
            page: this.page,
          },
        });
        setTimeout(() => {
          if (data.data.results.length != 0) {
            this.fetchMoreBookmarks(data.data.results);
            $state.loaded();
          } else {
            $state.complete();
          }
        }, 500);
      } catch (error) {
        $state.complete();
      }
    },
    fetchMoreBookmarks(newBookmarks) {
      this.$emit('fetchMoreBookmarks', newBookmarks);
    },
    async addBookmark(album, index) {
      try {
        await axios.$post("bookmarks", {
          id: album.albumId
        });
        // チップツールをv-for内で使うためにindexを渡す
        this.isBookmarkTooltip[index] = true;
        this.addCurrentUserBookmark(album.albumId);
        
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          // チップツールを閉じる
          this.isBookmarkTooltip = [];
        }, 1500);
      }
    },
    addCurrentUserBookmark(newBookmark) {
      // ブックマークした時に親コンポーネントのcurrentUserBookmarkにspotify_album_idを追加するため、emitで親コンポーネントに渡す
      this.$emit('addCurrentUserBookmark', newBookmark);
    },
    async deleteBookmark(album) {
      await axios.$delete("bookmarks/" + album.albumId);
      this.removeCurrentUserBookmark(album.albumId);
    },
    removeCurrentUserBookmark(deleteBookmark) {
      this.$emit('removeCurrentUserBookmark', deleteBookmark);
    },
  },
}
</script>

<style scoped>
.wrap-text {
  word-break: break-all;
  white-space: normal;
}

#songlink {
  width: 100%;
  height: 43px;
  overflow: hidden;
}

#songlink iframe {
  width: 112%;
  height: 43px;
  margin-left: -56px;
}

.detail-transparent {
  opacity: 0.85;
  border-color: transparent !important;
}
</style>