<template>
  <v-dialog
    v-model="loading"
    v-if="loading"
    fullscreen
    full-width
  > 
    <v-container fluid fill-height width="100%" style="background-color: rgba(150, 150, 150, 0.85);">
      <v-container>
        <v-row class="mb-12" justify="center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="70"
            width="7"
          >
          </v-progress-circular>
        </v-row>
        <v-row  justify="center">
          <div >
            <p v-if="isCreatePost" class="black--text text-h4 font-weight-bold"><v-icon left large color="light-green lighten-1">mdi-robot</v-icon>画像作成中です...<v-icon right large color="light-green lighten-1">mdi-robot</v-icon></p>
            <p v-if="isShareTwitter" class="black--text text-h4 font-weight-bold"><v-icon left large color="light-green lighten-1">mdi-robot</v-icon>ツイッターに投稿中です...<v-icon right large color="light-green lighten-1">mdi-robot</v-icon></p>
          </div>
        </v-row>
        <v-row  justify="center">
          <div>
            <p class="black--text text-h6 font-weight-bold">しばらくお待ちください。</p>
          </div>
        </v-row>
      </v-container>
    </v-container>
  </v-dialog>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    isCreatePost: {
      type: Boolean,
      default: false
    },
    isShareTwitter: {
      type: Boolean,
      default: false
    },
  },
}
</script>
