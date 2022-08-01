<template>
  <v-dialog 
    v-model="isIframe"
    v-if="isIframe"
    width="40vh"
    :height="`${isDetail ? '150vh' : '40vh'}`"
    class="dialog-shadow pa-10 ma10"
    overlay-color="grey darken-3"
    transition="fade-transition"
    content-class="elevation-0"
    @click:outside="closeDialog"
    :overlay-opacity="`${isSongList ? 0.5 : 0.3}`"
  >
    <!-- 閉じるボタン -->
    <v-card 
      color="white"
      class="transparent"
    >
      <v-card-actions> 
        <v-btn 
          @click="closeDialog"
          class="ml-0 pl-1 pt-1 pb-1 mb-1"
          icon
          rounded
          height="1px"
          width="1px"
          depressed
        >
          <v-icon color="red lighten-1">mdi-close-circle</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- /閉じるボタン -->
    <!-- SpotifyIframeの表示 -->
    <v-card class="transparent">
      <iframe
        style="border-radius:12px" 
        :src="`https://open.spotify.com/embed/${embedType}/${spotifyId}?utm_source=generator`" 
        width="100%" 
        height="380" 
        frameBorder="0" 
        allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      >
      </iframe>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    spotifyId: {
      type: String,
      required: true,
    },
    embedType: {
      type: String,
      required: true,
    },
    isIframe: {
      type: Boolean,
      default: false,
    },
    isSongList: {
      type: Boolean,
      default: false,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
};

</script>

<style>
.transparent {
  background-color: white!important;
  opacity: 0.95;
  border-color: transparent!important;
}
.dialog-shadow {
  box-shadow: none!important;
}
</style>