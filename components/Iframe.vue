<template>
  <v-dialog v-model="isDisplay" width="80vh">
    <v-card v-if="isDisplay">
      <v-card>
        <v-card-text >
          <iframe
            class="iframe" 
            :src="`https://open.spotify.com/embed/album/${song}`"
            width="100%" 
            height="100%" 
            frameBorder="1" 
            allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture;"
            allowfullscreen >
          </iframe>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center">
            <v-col cols="3" sm="4" >
              <v-btn @click="isDisplay=false">閉じる</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-card>
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