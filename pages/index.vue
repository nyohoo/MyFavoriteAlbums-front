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
    
    <v-row>
      <v-container class="pt-10">
        <v-row justify-center>
          <!-- <v-col cols="6" sm="3"> -->
            <SongList v-if="isVisible" v-for="result in results" :key="result.id" :result="result" />

            <!-- <v-hover v-slot:default="{ hover }">
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
                </v-card-text> -->

                <!-- <v-dialog v-model="dialog" width="500"> -->
                  <!-- <template v-slot:activator="{ on, attrs }"> -->
                    <!-- <v-btn v-bind="attrs" v-on="on" @click="setSong(result)"> -->
                      <!-- <v-icon size="35">mdi-play-circle-outline</v-icon> -->
                    <!-- </v-btn> -->
                  <!-- </template> -->
                    <!-- <v-card class="mx-auto" tile height="100%"> -->
                      <!-- <iframe -->
                        <!-- class="iframe"  -->
                        <!-- :src="song" -->
                        <!-- width="100%"  -->
                        <!-- height="100%"  -->
                        <!-- frameBorder="1"  -->
                        <!-- allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture;" -->
                        <!-- allowfullscreen > -->
                      <!-- </iframe> -->
                    <!-- </v-card> -->
                <!-- </v-dialog> -->

              <!-- </v-card>


            </v-hover> -->



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
          <!-- </v-col> -->
        </v-row>
      </v-container>
    </v-row> 
  </v-container>

</template>


<script>
import axios from '@/plugins/axios';
import SongList from '@/components/SongList';


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
  components: {
    SongList,
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
        console.log(this.isVisible);
      } else {
        this.results = [];
        this.isVisible = false;
        console.log("文字列なし！！！！！");
        console.log(this.isVisible);
        return;
      };
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