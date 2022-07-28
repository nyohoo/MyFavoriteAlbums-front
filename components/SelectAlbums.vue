<template>
  <v-dialog width="75vh" height="68vh"
    v-model="isDisplay" 
    v-if="isDisplay"
    @click:outside="closeDialog"
    >
    <v-card height="50%" width="100%">
      <v-container>
        <!-- ドラッグ＆ドロップで入れ替え可能にする -->
        <draggable
          v-if="results.length"
          v-model="results"
          element="div"
          :animation="210"
          style="justify-content: center; align-items: center"
          class="row pa-6 justify-center"
          :disabled="!isEdit"
        >
          <v-col
            v-for="result in results"
            :key="result.id"
            class="d-flex child-flex ma-0 pa-0"
            cols="4"
          >
            <!-- アルバム画像の表示 -->
            <v-img
              :src="result.images[0].url"
              :lazy-src="result.images[0].url"
              :alt="result.name"
              aspect-ratio="1"
              class="my-0 rounded-0"
              @click="openIframe(result)"
            >
              <!-- ローディング中の処理 -->
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
              <!-- 削除のためのチェックボックス -->
              <div class="checkbox" v-if="isEdit">
                <v-btn 
                  fab
                  x-small
                  class="ml-1 mb-1"
                  >
                  <v-checkbox 
                    v-model="isChecked"
                    :value="result"
                    @change="checkboxChange"
                    off-icon="mdi-delete"
                    on-icon="mdi-delete"
                    color="red"
                    class="mt-6 ml-3  checkbox-btn"
                  >
                  </v-checkbox>
                </v-btn>
              </div>
            </v-img>
          </v-col>
          <Iframe :isDisplay="iframe" :song="iframeTrack" @closeDialog="iframe = false" />
        </draggable>

        <!-- 選んだアルバムがない場合の表示 -->
        <v-container v-if="!results.length" style="height: 300px">
          <div style="height: 100%" class="text-center">
            <p class="subtitle-2 font-weight-bold mt-16 pt-16">
              <v-icon left dense>mdi-information</v-icon>
              ここに選んだアルバムが表示されます
              </p>
          </div>
        </v-container>

          <!-- 使い方を表示する -->
          <v-row justify="center" align="center" class="mt-3 mb-1" v-show="isEdit && !flashDelete">
            <!-- sm以下であれば非表示、それ以外では表示 -->
            <div class="hidden-sm-and-down">
              <p class="caption mb-0 text--secondary ">
                  <v-icon dense small>mdi-information</v-icon>
                  ドラッグ＆ドロップでアルバムの順番を変更できます
              </p>
            </div>
            <!-- md以上であれば非表示、それ以外では表示 -->
            <div class="hidden-md-and-up">
              <p class="caption mb-0 text--secondary">
                  <v-icon dense small>mdi-information</v-icon>
                  長押しでアルバムの順番を変更できます
              </p>
            </div>
          </v-row>
          <v-row justify="center" align="center" class="mt-3 mb-1" v-show="!isEdit && !flashCreate">
            <!-- sm以下であれば非表示、それ以外では表示 -->
            <div class="hidden-sm-and-down">
              <p class="caption mb-0 text--secondary ">
                  <v-icon dense small>mdi-information</v-icon>
                  クリックでアルバムの詳細を開きます
              </p>
            </div>
            <!-- md以上であれば非表示、それ以外では表示 -->
            <div class="hidden-md-and-up">
              <p class="caption mb-0 text--secondary">
                  <v-icon dense small>mdi-information</v-icon>
                  タップでアルバムの詳細を開きます
              </p>
            </div>
          </v-row>

          <!-- フラッシュメッセージの表示 -->
          <v-row justify="center" class="mt-3 mb-0 pb-0" no-gutters v-if="flashDelete && isEdit">
            <v-alert
              v-model="flashDelete"
              dense
              outlined
              type="error"
              elevation="1"
              class="my-0 py-0"
            >
            削除するアルバムを選択してください
            </v-alert>
          </v-row>
          <v-row justify="center" class="mt-3 mb-0 pb-0" no-gutters v-if="flashCreate && !isEdit">
            <v-alert
              v-model="flashCreate"
              dense
              outlined
              type="error"
              elevation="2"
              class="my-0 py-0"
            >
            アルバムを9枚選択してください
            </v-alert>
          </v-row>

        <v-card-actions>
          <v-row justify="center" align="center" class="mt-4 mb-6">
            <!-- 画像作成ボタン -->
            <v-btn 
              v-if="results.length && !isEdit"
              color="green"
              class="text-sm-button mx-1"
              rounded
              outlined
              @click="createAlbums"
            >
              <v-icon >
                mdi-check
              </v-icon>
              作成
            </v-btn>
            <!-- 画像編集ボタン -->
            <v-btn 
              v-if="results.length && !isEdit"
              color="blue"
              class="text-sm-button mx-1"
              @click="changeEdit"
              rounded
              outlined
            >
              <v-icon>
                mdi-pencil
              </v-icon>
              編集
            </v-btn>
            <!-- 削除ボタン -->
            <v-btn
              v-if="results.length && isEdit"
              color="red"
              class="text-sm-button mx-1"
              @click="deleteCheckedAlbums"
              rounded
              outlined
            >
              <v-icon>
                mdi-delete
              </v-icon>
              削除
            </v-btn>
            <!-- 編集完了ボタン -->
            <v-btn
              v-if="results.length && isEdit"
              color="blue"
              class="text-sm-button mx-1"
              @click="changeEdit"
              rounded
              outlined
            >
              <v-icon>
                mdi-pencil
              </v-icon>
              編集完了
            </v-btn>
            <!-- 閉じるボタン -->
            <v-btn
              color="white"
              @click="closeDialog"
              rounded
              outlined
              class="text-sm-button ml-2"
            >
              閉じる
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>


<script>
import draggable from 'vuedraggable'
import Iframe from '@/components/Iframe.vue'

export default {
  data() {
    return {
      isDisplay: false,
      isEdit: false,
      isChecked: [],
      flashDelete: false,
      flashCreate: false,
      iframe: false,
      iframeTrack: '',
    };
  },
  components: {
    draggable,
    Iframe,
  },
  computed: {
    results: {
      get() {
        return this.$store.state.albums.albums;
      },
      set(val) {
        return this.$store.dispatch('albums/updateAlbums', val);
      },
    },
  },
  methods: {
    openIframe(result) {
      console.log("openIframe");
      if (this.isEdit === false) {
      this.iframe = true;
      this.iframeTrack = result.id
      
      } else{
        return;
      }
    },
    deleteCheckedAlbums() {
      if (this.isChecked.length) {
        this.isChecked.forEach(album => {
          this.$store.dispatch("albums/deleteAlbums", album);
        });
        this.isChecked = [];
        if (this.results.length === 0) {
          this.isEdit = false;
        }
      } else {
        this.flashDelete = true;
        setTimeout(() => {
          this.flashDelete = false}
          ,3000
        );
      }
    },
    checkboxChange() {
      console.log(this.isChecked);
    },
    changeEdit() {
      if (this.isEdit) {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
    },
    closeDialog() {
      console.log("closeDialog処理");
      this.isDisplay = false;
      if (this.isEdit) {
        this.isEdit = false;
      };
      if (this.isChecked.length) {
        this.isChecked = [];
      };
    },
    async createAlbums() {
      try {
        // debounceで
        if (this.results.length === 9) {
        // ログイン中のユーザーか確認する
          if (this.$store.state.login.user) {
            // アルバムを作成する
            await this.$axios.$post("api/v1/posts", {
              album_ids: this.results.map(album => album.id),
              image_paths: this.results.map(album => album.images[0].url),
              hash_tag: "#私を構成する9枚"
            }).then(response => {
              console.log("レスポンス内容の確認");
              console.log(response);
              console.log("レスポンス内容ここまで");
            });
            // アルバム作成後に結果画面にリダイレクト
            // this.$router.push({
            //   name: "result",
            //   params: {
            //     id: data.id,
            //   },
            // });
          } else {
            // ログインしていない場合はログイン画面にリダイレクト
            this.$router.push({
              name: "login",
            });
          };
        } else {
          this.flashCreate = true;
          setTimeout(() => {
            this.flashCreate = false}
            ,3000
          );
        };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
.checkbox-btn {
  opacity: 1;
}

.checkbox {
  display: flex;
  position: absolute;
  bottom: 0;
}

</style>