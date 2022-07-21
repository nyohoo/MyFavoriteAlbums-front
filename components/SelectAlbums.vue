<template>
  <v-dialog width="60vh" height="60vh"
    v-model="isDisplay" 
    v-if="isDisplay"
    >
      <v-card height="50%">
        <div
          v-for="result in results"
          :key="result.id"
          class="images-brick-layout"
        >
          <div class="images-brick-item">
          <i :style="{ paddingBottom: paddingBottom}"></i>
          <v-img
            :src="result.album.images[0].url"
            :lazy-src="result.album.images[0].url"
            :alt="result.album.name"
            aspect-ratio="1"
            class="ma-2 mb-0 rounded-0 brick-item-image img"
            height="15vh"
            width="15vh"
          >
          </v-img>
            <!-- <v-btn @click="removeAlbums(result)" class="mr-auto ml-auto">
              <v-icon>mdi-minus</v-icon>
            </v-btn> -->
          </div>
        </div>
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
export default {
  data() {
    return {
      isDisplay: false,
    };
  },
  computed: {
    results() {
      return this.$store.state.albums.albums;
    },
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
.images-brick-layout{
  display: flex;
  flex-wrap: wrap;
  &:after{
    content: '';
    flex-grow: 999999999;
  }
  .images-brick-item{
    cursor: pointer;
    margin: 2px;
    position: relative;
  }
  i{
    display: block;
  }
  img {
    top: 0;
    width: 100%;
    vertical-align: bottom;
  }
}
</style>