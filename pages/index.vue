<template>
  <v-container>
    <v-container class="pt-7 pb-0">
      <v-row no-gutters>

        <!-- ハッシュタグの選択機能は一旦保留 -->
        <!-- <v-col cols="2" sm="8"  class="mr-4">
          <v-select
            v-model="select"
            :hint="`${select.state}`"
            :items="items"
            item-text="state"
            item-value="abbr"
            label="Select"
            persistent-hint
            return-object
            single-line
            dense
          ></v-select>
        </v-col> -->

        <v-col class="mr-2 py-0" cols="4" sm="8" >
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            label="Artist, Album, Songs"
            v-model="query"
            solo
            rounded
            @input="getSearch"
            id="searchField"
            :class="{ 'fixed': scrollY > 10 }"
          />
        </v-col>
        <v-col class="py-0 pl-3"
          cols="2" sm="2" md="2"
          >
          <v-btn @click="openSelectAlbums" rounded x-large >
            <v-icon class="mr-2">mdi-album</v-icon>画像作成
            <v-badge
              color="primary"
              v-if="this.albums.length"
              :content="this.albums.length"
            />
          <SelectAlbums ref="selectAlbums" /> 
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row justify-center>
        <SongList v-if="isVisible" v-for="result in results" :key="result.id" :result="result" class="d-flex child-flex" />
      </v-row>
    </v-container>
  </v-container>
</template>


<script>
import { axios }  from '@/plugins/axios';
import SongList from '@/components/SongList';
import SelectAlbums from '@/components/SelectAlbums';

export default {
  data() {
    return {
      query: '',
      results: [],
      isVisible: false,
      scrollY: 0,
      dialog: false,
      song: '',

      // select: { state: '#私を構成する9枚のアルバム', abbr: 'FL' },
      // items: [
      //   { state: '#私を構成する9枚のアルバム', abbr: 'FL' },
      //   { state: '#私を構成するHIP-HOP', abbr: 'GA' },
      //   { state: '#私を構成するインディーロック', abbr: 'NE' },
      //   { state: '#2022上半期ベストアルバム', abbr: 'CA' },
      //   { state: '#2022年間ベストアルバム', abbr: 'NY' },
      // ],


    };
  },  
  components: {
    SongList,
    SelectAlbums,
  },
  computed: {
    albums() {
      return this.$store.state.albums.albums;
    },
    },
  mounted() {
    document.getElementById("searchField").focus();
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    async getSearch() {
      if (this.query.length > 0) {
        const data = await axios.$get("/api/v1/search", {
          params: {
            query: this.query,
          },
        });

        this.results = data;
        this.isVisible = true;
        // console.log("文字列あり");
        // console.log(this.results);
        // console.log(this.isVisible);
      } else {
        this.results = [];
        this.isVisible = false;
        console.log("文字列なし");
        console.log(this.isVisible);
        return;
      };
    },
    pushAlbums(album) {
      if (this.albums.length < 5)
        this.$store.dispatch("albums/addAlbums", album);
    },
    removeAlbums(album) {
      this.$store.dispatch("albums/deleteAlbums", album);
    },
    checkSelectAlbum(result) {
      return this.albums.some((album) => album.id === result.id);
    },
    setSong(result) {
      this.song = `https://open.spotify.com/embed/album/${result.album.id}`;
      console.log(this.song);
    },
    handleScroll() {
      this.scrollY = window.scrollY;
    },
    openSelectAlbums() {
      this.$refs.selectAlbums.isDisplay = true
    },
  },
};
</script>

<style>
.iframe {
 width: 100%; 
 height: 380px; 
}
.fixed {
  /* 上部に固定する */
  position: fixed;
  z-index: 9999;
  top: 7px; 
}
</style>