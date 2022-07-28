<template>
  <v-dialog 
    v-model="isDisplay"
    v-if="isDisplay"
    width="40vh"
    max-width="350px"
    min-width="350px"
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
        class="iframe" 
        :src="`https://open.spotify.com/embed/album/${song}`" 
        frameborder="0"
        allowtransparency="true" 
        allow="encrypted-media"
        allowfullscreen
        style="border-radius:15px"
        >
      </iframe>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    song: {
      type: String,
      required: true,
    },
    isDisplay: {
      type: Boolean,
      default: false,
    },
    isSongList: {
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