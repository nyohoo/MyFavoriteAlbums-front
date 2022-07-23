<template>
  <v-dialog width="75vh" height="68vh"
    v-model="isDisplay" 
    v-if="isDisplay"
    @click:outside="closeDialog"
    >
    <v-card height="50%" width="100%">
      <v-container>
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

            <v-img
              :src="result.album.images[0].url"
              :lazy-src="result.album.images[0].url"
              :alt="result.album.name"
              aspect-ratio="1"
              class="my-0 rounded-0"
            >
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
        </draggable>

        <v-container v-if="!results.length" style="height: 300px">
          <div style="height: 100%" class="text-center">
            <p class="subtitle-2 font-weight-bold mt-16 pt-16">
              <v-icon left dense>mdi-information</v-icon>
              ここに選んだアルバムが表示されます
              </p>
          </div>
        </v-container>
          <v-row justify="center" align="center" class="mt-3" v-show="isEdit">
            <!-- sm以下であれば非表示、それ以外では表示 -->
            <div class="hidden-sm-and-down">
              <p class="caption mb-0 text--secondary ">
                  <v-icon dense small>mdi-information</v-icon>
                  ドラッグ＆ドロップでアルバムの順番を変更できます。
              </p>
            </div>
            <!-- md以上であれば非表示、それ以外では表示 -->
            <div class="hidden-md-and-up">
              <p class="caption mb-0 text--secondary hidden-md-and-up">
                  <v-icon dense small>mdi-information</v-icon>
                  長押しでアルバムの順番を変更できます。
              </p>
            </div>
          </v-row>
        <v-card-actions>
          <v-row justify="center" align="center" :class="[isEdit === true ? 'mt-6 mb-7' : 'mt-12 mb-6 pb-1']" >
            <v-btn 
              v-if="results.length && !isEdit"
              color="blue"
              class="text-sm-button mr-4"
              @click="changeEdit">
              <v-icon>
                mdi-pencil
              </v-icon>
              編集
            </v-btn>
            <v-btn
              v-if="results.length && isEdit"
              color="info"
              class="text-sm-button mr-4"
              @click="deleteCheckedAlbums">
              <v-icon>
                mdi-delete
              </v-icon>
              削除
            </v-btn>
            <v-btn
              v-if="results.length && isEdit"
              color="blue"
              class="text-sm-button mr-4"
              @click="changeEdit"
              >
              <v-icon>
                mdi-pencil
              </v-icon>
              編集完了
            </v-btn>
            <v-btn color="primary" @click="closeDialog">
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

export default {
  data() {
    return {
      isDisplay: false,
      isEdit: false,
      
      isSetRemove: [],
      isChecked: [],
    };
  },
  components: {
    draggable,
  },
  computed: {
    results: {
      get() {
        return this.$store.state.albums.albums;
      },
      set(val) {
        return this.$store.dispatch('albums/updateAlbums', val);
      },
    }
  },
  methods: {
    deleteCheckedAlbums() {
      console.log("deleteAllAlbumsの処理開始");
      console.log(this.isChecked);
      if (this.isChecked.length) {
        this.isChecked.forEach(album => {
          this.$store.dispatch("albums/deleteAlbums", album);
        });
      }
    },
    setRemove(result) {
      this.isSetRemove.push(result);
      console.log(this.isSetRemove);
    },
    releaseRemove(result) {
      this.isSetRemove.splice(this.isSetRemove.indexOf(result), 1);
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