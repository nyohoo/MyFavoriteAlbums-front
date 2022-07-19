<template>
  <v-col cols="6" sm="3">
    <v-hover v-slot="{ hover }">
      <v-card class="album-card" tile >
        <!-- issue:hoverがつかない・・・ -->
        <v-card tile >
          
          <v-img
            :src="result.album.images[0].url"
            :lazy-src="result.album.images[0].url"
            :alt="result.album.name"
            aspect-ratio="1"
            @click="openDisplay"
            :class="{ 'on-hover': hover }"
            :elevation="hover ? 12 : 2"
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
                  color="green lighten-2"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          
        </v-card>
        
      <v-card-text class="pt-3">
        <p class="body-2 font-weight-medium ma-0 text-truncate white--text">
          {{ result.album.name }}
        </p>
        <p class="caption font-weight-light mb-4 text-truncate">
          {{ result.album.artists[0].name }}
        </p>
      </v-card-text>
        <v-container>
          <v-btn @click="openDisplay">
            <v-icon size="35">mdi-play-circle-outline</v-icon>
          </v-btn>
          <Iframe ref="iframe" :song="result.album.id" />
        </v-container>
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
  methods: {
    openDisplay() {
      this.$refs.iframe.isDisplay = true
    },
  },
};
</script>

<style>

</style>