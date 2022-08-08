<template>
  <v-col cols="6" sm="3">
    <v-card class="album-card rounded fadeUp">
      <v-hover v-slot:default="{ hover }">
        <v-card :class="hover ? 'songlist-transparent' : ''" tile class="fadeDown">
          <v-img :src="result.images[0].url" :lazy-src="result.images[0].url" :alt="result.name"
            :class="{ 'pointer': hover }" :style="{ 'cursor': hover ? 'pointer' : 'default' }" aspect-ratio="1"
            @click="openAlbumIframe(result)" class="ma-2 mb-0 rounded-0">
            <!-- ローディング中の処理 -->
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="green lighten-3"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-hover>
      <v-card-text class="pt-3 pb-0">
        <v-hover v-slot:default="{ hover }">
          <p class="font-weight-bold ma-0 text-truncate" :style="{ 'color': hover ? '#008000' : '#FFF' }"
            @click="openAlbumIframe(result)">
            {{ result.name }}
          </p>
        </v-hover>
        <!-- ホバー可能にする -->
        <v-hover v-slot:default="{ hover }">
          <p class="caption font-weight-light mb-0 text-truncate" :class="{ 'text-caption': hover }"
            :style="{ 'color': hover ? '#008000' : '' }" @click="openArtistIframe(result)">
            {{ result.artists[0].name }}
          </p>
        </v-hover>
      </v-card-text>

      <!-- ボタン -->
      <v-card-actions class="ma-0 pt-0 pb-2">
        <v-btn @click="openAlbumIframe(result)" class="ma-0" fab icon height="40px" right width="40px">
          <v-icon color="secondary">mdi-play-circle</v-icon>
        </v-btn>
        <v-btn v-if="checkSelectAlbum(result)" @click="removeAlbums(result)" class="ml-2" fab icon height="40px" right
          width="40px">
          <v-icon color="primary">mdi-heart</v-icon>
          <v-badge color="primary" v-if="albums.length" :content="getAlbumIndex(result) + 1" />
        </v-btn>
        <v-btn v-else-if="checkCountAlbum()" @click="pushAlbums(result)" class="ml-2" fab icon height="40px" right
          width="40px">
          <v-icon>mdi-heart-plus</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <Iframe :isIframe="iframe" :isSongList="isSongList" :spotifyId="spotifyId" :embedType="embedType"
      @closeDialog="iframe = false, isSongList = false, embedType = ''" />
  </v-col>
</template>

<script>
import Iframe from '@/components/Iframe.vue'

export default {
  data() {
    return {
      iframe: false,
      isSongList: false,
      spotifyId: '',
      embedType: '',
    };
  },
  props: {
    result: {
      type: Object,
      required: true,
    },
  },
  components: {
    Iframe,
  },
  computed: {
    albums() {
      return this.$store.state.albums.albums;
    },
  },
  methods: {
    openAlbumIframe({ id }) {
      this.iframe = true
      this.isSongList = true
      this.embedType = 'album'
      this.spotifyId = id
    },
    openArtistIframe(result) {
      this.iframe = true
      this.isSongList = false
      this.embedType = 'artist'
      this.spotifyId = result.artists[0].id
    },
    pushAlbums(album) {
      this.$store.dispatch("albums/addAlbums", album);
    },
    removeAlbums(album) {
      this.$store.dispatch("albums/deleteAlbums", album);
    },
    checkSelectAlbum(result) {
      return this.albums.some((album) => album.id === result.id);
    },
    getAlbumIndex(result) {
      return this.albums.findIndex((album) => album.id === result.id);
    },
    checkCountAlbum() {
      return this.albums.length < 9;
    },
  },
};
</script>

<style>
.songlist-transparent {
  opacity: 0.75;
  border-color: transparent !important;
}

.fadeUp{
animation-name:fadeUpAnime;
animation-duration: 0.5s;
animation-fill-mode:forwards;
opacity:0.7;
}

@keyframes fadeUpAnime{
  from {
    opacity: 0.1;
    transform: translateY(7px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>