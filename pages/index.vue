<template>
  <v-container>
    <v-container>
      <v-row >
        <v-col class="py-0" cols="12" sm="8" md="6">
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

export default {
  data() {
    return {
      query: '',
      results: [],
      isVisible: false,
      scrollY: 0,
      dialog: false,
      song: '',
    };
  },  
  components: {
    SongList,
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
  },
};
</script>

<style>
.iframe {
 left: 0; 
 width: 100%; 
 height: 380px; 
 position: relative;
}
.fixed {
  /* 上部に固定する */
  position: fixed;
  z-index: 9999;
  top: 7px; 
}
</style>