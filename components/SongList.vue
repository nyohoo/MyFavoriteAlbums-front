<template>
  <v-col cols="6" sm="3">
    <v-hover v-slot:default="{ hover }">
      <v-card class="album-card" flat>
        <v-card tile @click="openDisplay">
          <v-img
            class="elevation-10"

            :src="result.album.images[0].url"
          >
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