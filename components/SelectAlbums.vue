<template>
  <v-dialog width="65vh" height="60vh"
    v-model="isDisplay" 
    v-if="isDisplay"
    >
      <v-card height="50%">

        <draggable
          v-if="results.length"
          v-model="results"
          element="div"
          :animation="260"
          style="justify-content: center; align-items: center"
          class="row pa-10"
          height="900"
        >

          <v-col
            v-for="result in results"
            :key="result.id"
            class="d-flex child-flex ma-0 pa-0"
            cols="4"
          >
            <v-img
              :src="result.album.images[0].url"
              :lazy-src="result.album.images[0].url"
              :alt="result.album.name"
              aspect-ratio="1"
              class="ma-0 rounded-0"
            >

              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>

            </v-img>
              <!-- <v-btn @click="removeAlbums(result)" class="mr-auto ml-auto">
                <v-icon>mdi-minus</v-icon>
              </v-btn> -->
          </v-col>

        </draggable>



        <v-container v-if="!results.length" style="height: 300px">
          <div style="height: 100%" class="text-center">
            <p class="mt-16">ここに選んだアルバムが表示されます。</p>
          </div>
        </v-container>
        <v-card-actions>
          <v-row justify="center" align="center" class="mb-8 mt-8">
            <!-- <v-btn
              color="green"
              class="mr-4 text-sm-button"
              @click="goResult"
            >
              画像を作成する
            </v-btn>
            <v-btn color="red" @click="deleteAllAlbums">
              選んだアルバムを全て削除する
            </v-btn> -->
            <v-btn color="blue" @click="closeDialog" class="ml-4">
              閉じる
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  data() {
    return {
      isDisplay: false,
    };
  },
  components: {
    draggable,
  },
  computed: {
    results: {
      get() {
        return this.$store.state.albums.albums;
      },
      set(val) {
        return this.$store.dispatch('albums/updateAlbums', val);
      },
    }
  },
  methods: {
    removeAlbums(result) {
      this.$store.dispatch("albums/deleteAlbums", album);
    },
    closeDialog() {
      this.isDisplay = false;
    },
  },
};
</script>

<style>
</style>