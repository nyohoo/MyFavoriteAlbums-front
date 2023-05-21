<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" class="mt-10">
        <v-card class="elevation-12 pa-5" outlined>
          <v-card-title class="headline mb-5">
            <span class="font-responsive">投稿が見つかりませんでした</span>
          </v-card-title>
          <v-card-text class="subtitle-1">
            <span class="font-responsive">
              お探しの投稿は見つかりませんでした。<br>以下のリンクから投稿一覧に戻るか、<br>再度検索してみてください。
            </span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" nuxt to="/list">投稿一覧へ戻る</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  head() {
    return {
      title: '投稿が見つかりませんでした',
    };
  },
}
</script>

<style scoped>
.font-responsive {
  font-size: calc(14px + (26 - 16) * ((100vw - 300px) / (1600 - 300)));
  line-height: 1.5;
}
</style>
