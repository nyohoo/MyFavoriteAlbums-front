<template>
  <!-- 削除確認のモーダル -->
  <v-dialog v-model="isConfirmDialog" @click:outside="closeDialog" max-width="330px">
    <div class="text-center">
      <v-card
        class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block"
        color="green-grey darken-3"
        dark
        
      >
        <div class="grey--text text--lighten-1 text-body-2 mb-4">
          投稿を削除します。よろしいですか？
        </div>

        <v-btn
          class="ma-1"
          color="grey"
          plain
          @click="closeDialog"
        >
          キャンセル
        </v-btn>

        <v-btn
          class="ma-1"
          color="error"
          plain
          @click="removePost"
          v-if="!isLoading"
        >
        削除
        </v-btn>
        <v-btn
          class="ma-1"
          color="error"
          plain
          @click="removePost"
          disabled
          v-if="isLoading"
        >
          <v-progress-circular
            indeterminate
            color="green lighten-3"
            
          >
          削除
          </v-progress-circular>
        </v-btn>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import { axios } from "@/plugins/axios";

export default {
  data() {
    return {
      isLoading: false,
    };
  },
  props: {
    isConfirmDialog: {
      type: Boolean,
      default: false,
    },
    postUuid: {
      type: String,
      default: "",
    },
    userUid: {
      type: String,
      default: "",
    },
  },
  methods: {
    async removePost() {
        this.isLoading = true;
      try {
        await axios.$delete("posts", {
          params: {
            uuid: this.postUuid,
          },
        });
        this.isLoading = false;
        // 削除したらユーザー画面に遷移する
        this.$router.push(`/users/${this.userUid}`);
      } catch (error) {
        this.isLoading = false;
        console.log(error);
      }
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
}
</script>