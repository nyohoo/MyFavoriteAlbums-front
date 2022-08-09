<template>
  <v-container>
    <!-- スクロールが閾値を超えると検索・作成ボタンがスクロール追従するクラスを付与 -->
    <v-col cols="12" xs="11" sm="10" md="8" :class="[isScroll ? 'fixed fadeUp' : '']" class="mb-0 pb-0">
      <!-- 検索フォーム -->
      <v-text-field type="text" hint="Artist, Album, Songs" placeholder="Search" 
        v-model="query" solo :dense="isScroll" @input="handleChange"
        id="searchField" @click:append="openHelpDialog">
        <template v-slot:prepend>
          <v-tooltip
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">
                mdi-help-circle
              </v-icon>
            </template>
            使い方説明まだ未実装です...
          </v-tooltip>
        </template>
        <template v-slot:append-outer>
          <v-btn @click="openSelectAlbums" rounded class="my-0 ml-0" style="top: -5px;" :tile="isScroll"
            :width="isScroll ? '80%' : '90%'" :large="!isScroll" >
            <v-icon left>mdi-check-circle-outline</v-icon>
            作成
            <v-badge color="primary" v-if="albums.length" :content="albums.length" />
          </v-btn>
        </template>
      </v-text-field>
    </v-col>

    <!-- ハッシュタグの選択機能 -->
    <v-col cols="10" md="4" lg="4" sm="7" class="mt-0 pt-1 ml-9" d-flex >
      <v-select
        v-model="selectedHashtag"
        :items="items"
        return-object
        dense
        class="text-caption"
        @change="addHashtag()"
      >
      </v-select>
    </v-col>

    <IndexHelpDialog :helpDialog="isHelpDialog" @closeDialog="isHelpDialog = false" />
    <SelectAlbums ref="selectAlbums" />

    <!-- 検索結果の表示 -->
    <v-container>
      <v-row justify-center>
        <SongList v-if="isVisible" v-for="result in results" :key="result.id" :result="result"
          class="d-flex child-flex" />

        <!-- 無限スクロール -->
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
import IndexHelpDialog from '../components/IndexHelpDialog.vue';

// 検索の結果をデバウンスするための変数
const debounce = (func, wait = 250) => {
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
      isHelpDialog: false,
      selectedHashtag: '#私を構成する9枚',
      items: [
        '#私を構成する9枚',
        '#私を構成する9枚のロックアルバム',
        '#私を構成する9枚のHIP-HOP',
        '#私を構成する9枚のアニソン',
        '#私を構成する9枚のインディーロック',
        '#2022上半期ベストアルバム',
        '#2022年間ベストアルバム',
      ],
    };
  },
  components: {
    SongList,
    SelectAlbums,
    IndexHelpDialog
},
  computed: {
    albums() {
      return this.$store.state.albums.albums;
    },
    hashtag() {
      return this.$store.state.albums.hashtag;
    }
  },
  mounted() {
    document.getElementById("searchField").focus();
    window.addEventListener('scroll', this.handleScroll);
    this.setDefaultHashtag();
  },
  watch: {
    scrollY() {
      if (scrollY > 30) {
        this.isScroll = true;
      } else {
        this.isScroll = false;
      }
    }
  },
  methods: {
    handleChange: debounce(function () {
      this.getSearch();
    }, 300),
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
    setDefaultHashtag() {
      // ローカルストレージが空の場合はデフォルトのハッシュタグを利用する
      if (!localStorage.getItem('albums')) return;
      // vuexで永続化しているハッシュタグをローカルストレージから取得してセット
      this.selectedHashtag = JSON.parse(window.localStorage.getItem("albums")).albums.hashtag;
    },
    addHashtag() {
      this.$store.dispatch("albums/addHashtag", this.selectedHashtag);
    },
    handleScroll() {
      this.scrollY = window.scrollY;
    },
    openSelectAlbums() {
      this.$refs.selectAlbums.isDialog = true
    },
    openHelpDialog() {
      this.isHelpDialog = true;
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
  z-index:10;
  top: 52px;
  width: 50vh;
  opacity: 0.9;
}

.fadeUp{
animation-name:fadeUpAnimation;
animation-duration: 0.4s;
animation-fill-mode:forwards;
opacity:0;
}

@keyframes fadeUpAnimation{
  from {
    opacity: 0.1;
  transform: translateY(10px);
  }

  to {
    opacity: 0.9;
  transform: translateY(0);
  }
}
</style>