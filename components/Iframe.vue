<template>
  <v-dialog 
    v-model="isDisplay"
    v-if="isDisplay"
    width="40vh"
    max-width="350px"
    min-width="350px"
    class="dialog-shadow pa-10 ma10"
    overlay-opacity=0.65
    overlay-color="grey darken-3"
    transition="fade-transition"
    content-class="elevation-0"
      >
    <!-- 要検討：iframeにボタンを設置するかどうか -->
    <!-- <v-card 
      v-if="isDisplay"
      color="white"
      class="transparent"
      >
        <v-card-actions> 
              <v-btn 
                @click="isDisplay=false"
                class="ml-0 mt-2 mb-2"
                icon
                height="1px"
                right
                width="1px">
                <v-icon color="red lighten-1">mdi-close-circle</v-icon>
                </v-btn>
        </v-card-actions>
        </v-card> -->
        <!-- <v-card-actions> -->
      
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
      
        <!-- </v-card-actions> -->
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      isDisplay: false,
    };
  },
  props: {
    song: {
      type: String,
      required: true,
    },
  },
};

</script>

<style>
.transparent {
  background-color: white!important;
  opacity: 0.9;
  border-color: transparent!important;
}
.dialog-shadow {
  box-shadow: none!important;
}
</style>