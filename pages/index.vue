<template>
  <v-container>
    <div class="search-sticky">
      <v-row>
        <v-col class="py-0" cols="12" sm="8" md="6">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            type="search"
            label="アルバム検索"
            v-model="query"
            solo
            height="50"
            rounded
            @input="getSearch"
            class="mt-4"
            id="searchField"
            hint="アーティスト、曲、アルバム名など"
          />
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-container class="darken-4">
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

                  <div
                    style="position: absolute; right: 10px; bottom: 10px"
                    v-show="hover"
                  >
                    <v-icon size="35">mdi-play-circle-outline</v-icon>
                  </div>
                </v-card-text>
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

<!-- <iframe
              class:="iframe" 
              :src="`https://open.spotify.com/embed/album/${result.album.id}`" 
              width="100%" 
              height="100%" 
              frameBorder="1" 
              allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture;"
              allowfullscreen >
              </iframe> -->

<script>
import axios from '@/plugins/axios';


export default {

  name: "TopIndex",
  data() {
    return {
      query: '',
      results: [],
      isVisible: false,
    };
  },  
  mounted() {
    document.getElementById("searchField").focus();
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
</style>