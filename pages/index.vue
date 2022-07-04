<template>
  <v-container>
    <v-row>
      <v-text-field
        prepend-icon="mdi-magnify-plus-outline"
        type="search"
        label="アルバム検索"
        v-model="query"
        solo
        height="30"
        rounded
        @input="getSearch"
        class="mt-4"
        id="searchField"
        hint="アルバム名またはアーティスト名を入力"
      />
    </v-row>
    <v-row>
      <v-col v-for="result in results" :key="result.id" cols="6" sm="3">
        <v-card height="100%" class="black--text white">
          <v-img
            :src="'http://image.tmdb.org/t/p/w300/' + result.poster_path"
          />
          <v-card-title class="justify-center text-body-1 text-sm-h6">{{
            result.title
          }}</v-card-title>
          <v-card-subtitle
            class="black--text justify-center text-caption text-sm-body-2"
          >
            {{ result.release_date }}
          </v-card-subtitle>
          <v-card-actions class="justify-center">
            <v-btn
              v-if="checkSelectMovie(result)"
              @click="removeMovies(result)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn v-else @click="pushMovies(result)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text v-if="toggle" class="black--text">
            {{ result.overview }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  asyncData({ $config: { apiKey } }) {
    return { apiKey };
  },
  name: "TopIndex",
  data() {
    return {
      query: "",
      results: [],
    };
  },
  computed: {
    movies() {
      return this.$store.state.movies.movies;
    },
  },
  mounted() {
    document.getElementById("searchField").focus();
  },
  methods: {
    getSearch() {
      this.$axios
        .get("https://api.themoviedb.org/3/search/movie", {
          params: { api_key: this.apiKey, query: this.query, language: "ja" },
        })
        .then((response) => {
          this.results = response.data.results;
        })
        .catch(() => {
          location.reload();
        });
    },
    pushMovies(movie) {
      if (this.movies.length < 5)
        this.$store.dispatch("movies/addMovies", movie);
    },
    removeMovies(movie) {
      this.$store.dispatch("movies/deleteMovies", movie);
    },
    checkSelectMovie(result) {
      return this.movies.some((movie) => movie.id === result.id);
    },
  },
};
</script>