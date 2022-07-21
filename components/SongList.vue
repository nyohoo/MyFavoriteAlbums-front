<template>

  <v-col cols="6" sm="3">
    <v-hover v-slot="{ hover }">
      <v-card class="album-card rounded"
          >
        <!-- issue:hoverがつかない・・・ -->
          <v-card 
            tile 
            flat
          >
          <v-img
            :src="result.album.images[0].url"
            :lazy-src="result.album.images[0].url"
            :alt="result.album.name"
            aspect-ratio="1"
            @click="openIframe"
            class="ma-2 mb-0 rounded-0"
          >
            <!-- ローディング中の処理 -->
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="green lighten-3"
                ></v-progress-circular>
              </v-row>
            </template>
            <!-- <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out  darken-2 v-card--reveal text-h2 white--text"
                style="height: 100%;"
              >
          <v-btn
            @click="openIframe"
            class="ml-0"
            fab
            icon
            height="40px"
            right
            width="40px"
          >
            <v-icon color="green">mdi-play-circle</v-icon>
            
          </v-btn>
              </div>
            </v-expand-transition> -->
          </v-img>
          </v-card>
        
        
        <v-card-text class="pt-3 pb-0">
          <p class="body-2 font-weight-medium ma-0 text-truncate">
            {{ result.album.name }}
          </p>
          <p class="caption font-weight-light mb-0 text-truncate">
            {{ result.album.artists[0].name }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="openIframe"
            class="ml-0"
            fab
            icon
            height="40px"
            right
            width="40px"
          >
            <v-icon>mdi-play-circle</v-icon>
            <Iframe ref="iframe" :song="result.album.id" />
          </v-btn>
          <v-btn
            v-if="checkSelectAlbum(result)"
            @click="removeAlbums(result)"
            class="ml-2"
            fab
            icon
            height="40px"
            right
            width="40px"
          >
            <v-icon color="green">mdi-heart</v-icon>
          </v-btn>
          <v-btn
            v-else-if="checkCountAlbum()"
            @click="pushAlbums(result)"
            class="ml-2"
            fab
            icon
            height="40px"
            right
            width="40px"
          >
            <v-icon>mdi-heart-plus</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import Iframe from '@/components/Iframe.vue'


export default {
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
    openIframe() {
      this.$refs.iframe.isDisplay = true
    },
    pushAlbums(album) {
      if (this.albums.length < 9) {
        this.$store.dispatch("albums/addAlbums", album);
      }
    },
    removeAlbums(album) {
      this.$store.dispatch("albums/deleteAlbums", album);
    },
    checkSelectAlbum(result) {
      return this.albums.some((album) => album.id === result.id);
    },
    checkCountAlbum() {
      return this.albums.length < 9;
    },
  },
};
</script>