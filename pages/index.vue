<template>
  <v-container>
    <v-container>
      <v-row >
        <v-col class="py-0" cols="12" sm="8" md="6">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            type="search"
            label="アーティスト、曲、アルバム名"
            v-model="query"
            solo
            height="20"
            rounded
            @input="getSearch"
            id="searchField"
            :class="{ 'fixed': scrollY > 10 }"
          />
        </v-col>
      </v-row>
    </v-container>
    
    <v-row>
      <v-container class="pt-10">
        <v-row justify-center>
          <v-col v-if="isVisible" v-for="result in results" :key="result.id" cols="6" sm="3">
            <v-hover v-slot:default="{ hover }">
              <v-card class="album-card" flat>
                <v-card-text>
                  <v-img
                    class="elevation-10"
                    :src="result.album.images[0].url"
                  >
                  </v-img>
                </v-card-text>

                <v-card-text class="pt-0">
                  <p class="body-2 font-weight-medium ma-0 text-truncate white--text">
                    {{ result.album.name }}
                  </p>
                  <p class="caption font-weight-light mb-4 text-truncate">
                    {{ result.album.artists[0].name }}
                  </p>
                </v-card-text>

                <v-dialog v-model="dialog" width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" @click="setSong(result)">
                      <v-icon size="35">mdi-play-circle-outline</v-icon>
                    </v-btn>
                  </template>
                    <v-card class="mx-auto" tile height="100%">
                      <iframe
                        class:="iframe" 
                        :src="song"
                        width="100%" 
                        height="300px" 
                        frameBorder="1" 
                        allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture;"
                        allowfullscreen >
                      </iframe>
                    </v-card>
                </v-dialog>

              </v-card>


            </v-hover>



            <!-- <v-card class="mx-auto" tile height="100%">
              <v-card tile>
                <v-img :src="result.album.images[0].url"></v-img>
              </v-card>
              <v-card-title
                class="text-h5"
                v-text="result.album.name"
              ></v-card-title>
              <v-card-subtitle
               v-text="result.album.artists[0].name"
              ></v-card-subtitle>
            </v-card> -->
          </v-col>
        </v-row>
      </v-container>
    </v-row> 
  </v-container>

</template>


<script>
import axios from '@/plugins/axios';


export default {

  name: "TopIndex",
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
  mounted() {
    document.getElementById("searchField").focus();
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    async getSearch() {
      if (this.query.length > 0) {
        const { data } = await axios.get("/api/v1/search", {
          params: {
            query: this.query,
          },
        });
        this.results = data;
        this.isVisible = true;
        console.log(this.results);
        console.log(this.results.length);
      } else {
        this.results = [];
        this.isVisible = false;
        return;
        console.log("エラーです");
      };
    },
    setSong(result) {
      this.song = `https://open.spotify.com/embed/album/${result.album.id}`;
      console.log(this.song);
    },
    getSong() {
      return this.song;
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
  z-index: 1;
}
</style>