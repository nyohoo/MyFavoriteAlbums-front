<template>
  <v-container>
    <!-- スクロールが閾値を超えると検索・作成ボタンがスクロール追従するクラスを付与 -->
    <v-col cols="12" sm="8" md="8" :class="[isScroll ? 'fixed' : '']">

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
      v-col> -->

      

      <!-- 検索フォーム -->
      <v-text-field type="text" label="Artist, Album, Songs" v-model="query" :solo="isScroll" @input="handleChange"
        id="searchField" append-icon="mdi-search" @click:append="sendQuery">
        <template v-slot:append-outer>
          <v-btn @click="openSelectAlbums" rounded class="my-0 ml-0" style="top: -10px;" :tile="isScroll"
            :width="isScroll ? '1%' : '90%'" large>
            <v-icon left>mdi-playlist-check</v-icon>作成
            <v-badge color="primary" v-if="albums.length" :content="albums.length" />
          </v-btn>
          <!-- </v-col> -->
        </template>
      </v-text-field>
    </v-col>



    <SelectAlbums ref="selectAlbums" />

    <!-- 検索結果の表示 -->
    <v-container>
      <v-row justify-center>
        <SongList v-if="isVisible" v-for="result in results" :key="result.id" :result="result"
          class="d-flex child-flex" />

        <infinite-loading @infinite="infiniteHandler">
          <div slot="no-more" v-show="isInfinity">No more message</div>
        </infinite-loading>
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
      isScroll: false,
      dialog: false,
      song: '',
      isInfinity: false,

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
  watch: {
    scrollY() {
      if (scrollY > 10) {
        this.isScroll = true;
      } else {
        this.isScroll = false;
      }
    }
  },
  methods: {
    handleChange: debounce(function () {
      this.getSearch();
    }, 650),
    async getSearch() {
      // 検索クエリーがない場合はresultsを消してリターン
      if (this.query.length === 0) {
        this.results = [];
        this.isVisible = false;
        this.isInfinity = false;
        return;
      }

      if (this.isInfinity) {
        this.results = [];
        this.isInfinity = false;
      }

      const data = await axios.$get("search", {
        params: {
          query: this.query
        },
      });
      this.results.push(...data);
      this.isVisible = true;
      this.isInfinity = true;
    },
    async infiniteHandler($state) {
      try {
        this.isInfinity = true;
        const data = await await axios.$get("add_search", {
          params: {
            query: this.query,
            count: this.results.length
          },
        })
        //そのままだと読み込み時にカクつくので1500毎に読み込む
        setTimeout(() => {
          if (!data.no_result) {
            this.results.push(...data)
            $state.loaded()
          } else {
            $state.complete()
          }
        }, 1500)
      } catch (error) {
        $state.complete()
      }
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
    sendQuery() {
      this.handleChange();
    }
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
  top: 52px;
  width: 50vh;
  opacity: 0.95;
}
</style>