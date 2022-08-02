<template>
  <v-container>

    <v-card color="#121212" flat tile>
      <v-container class="pt-7 pb-0">
        <v-row>
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
          <v-col class="mr-2 py-0" cols="12" sm="8" md="8">
            <!-- 検索フォーム -->
            <v-text-field 
              prepend-inner-icon="mdi-magnify" 
              label="Artist, Album, Songs" 
              v-model="query"
              :solo="scrollY > 10" 
              @input="handleChange" 
              id="searchField" 
              :class="{ 'fixed': scrollY > 10 }"
            >
              <template v-slot:append-outer>
                <!-- <v-col class="mt-0 pt-0"
              cols="2" sm="2" md="2"
            > -->
                <v-btn @click="openSelectAlbums" rounded large class="my-0 ml-0" style="top: -10px;"
                  :tile="scrollY > 10">
                  <v-icon left>mdi-playlist-check</v-icon>作成
                  <v-badge color="primary" v-if="albums.length" :content="albums.length" />
                  <SelectAlbums ref="selectAlbums" />
                </v-btn>
                <!-- </v-col> -->
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- 検索結果の表示 -->
    <v-container>
      <v-row justify-center>
        <SongList 
          v-if="isVisible" 
          v-for="result in results" 
          :key="result.id" 
          :result="result"
          class="d-flex child-flex" 
        />
      </v-row>
    </v-container>
  </v-container>
</template>


<script>
import { axios } from '@/plugins/axios';
import SongList from '@/components/SongList';
import SelectAlbums from '@/components/SelectAlbums';

const debounce = (func, wait = 500) => {
  var timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

export default {
  head() {
    return {
      title: '投稿作成',
      meta: [
        {
          name: 'description',
          content: '投稿作成ページです。'
        },
        {
          name: 'keywords',
          content: '投稿作成, 投稿, 作成, 検索, 検索ページ'
        }
      ]
    }
  },
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
    handleChange: debounce(function () {
      this.getSearch();
    }, 500),
    async getSearch() {
      if (this.query.length > 0) {
        const data = await axios.$get("/api/v1/search", {
          params: {
            query: this.query
          },
        });
        this.results.push(...data);
        this.isVisible = true;
      } else {
        this.results = [];
        this.isVisible = false;
        return;
      };
    },
    removeAlbums(album) {
      this.$store.dispatch("albums/deleteAlbums", album);
    },
    checkSelectAlbum(result) {
      return this.albums.some((album) => album.id === result.id);
    },
    setSong(result) {
      this.song = `https://open.spotify.com/embed/album/${result.album.id}`;
    },
    handleScroll() {
      this.scrollY = window.scrollY;
    },
    openSelectAlbums() {
      this.$refs.selectAlbums.isDialog = true
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
  z-index: 10;
  top: 7px;
}
</style>