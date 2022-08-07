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
        >
          削除
        </v-btn>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import { axios } from "@/plugins/axios";

export default {
  props: {
    isConfirmDialog: {
      type: Boolean,
      default: false,
    },
    post_uuid: {
      type: String,
      default: '',
    },
  },
  methods: {
    removePost() {
      try {
        console.log(this.post_uuid);
        axios.$delete("posts/" + this.post_uuid);
        this.$router.push("/");
        // issue:削除完了メッセージを表示する
      } catch (error) {
        console.log(error);
      }
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
}
</script>