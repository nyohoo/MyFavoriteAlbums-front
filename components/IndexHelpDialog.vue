<template>
  <!-- 削除確認のモーダル -->
  <v-dialog v-model="helpDialog" @click:outside="closeDialog" max-width="330px">
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

        >
        削除
        </v-btn>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>

export default {
  props: {
    helpDialog: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
}
</script>