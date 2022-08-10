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
            color="rgba(255, 255, 0, 0.7)"
            size="50"
            width="4"
          >
          </v-progress-circular>
        </v-row>
        <v-row  justify="center">
          <div >
            <ul v-if="isCreatePost">
              <li>画</li>
              <li>像</li>
              <li>作</li>
              <li>成</li>
              <li>中</li>
            </ul>
            <ul v-if="isShareTwitter">
              <li>ツ</li>
              <li>イ</li>
              <li>ー</li>
              <li>ト</li>
              <li>中</li>
            </ul>            
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

<style scoped>
ul {
  display: flex;
}

li {
  list-style: none;
  font-weight: bold;
  font-size: 22px;
  letter-spacing: 10px;
  animation: loading 1.4s linear infinite;
}

@keyframes loading {
  0% {
    color: #111604;
    text-shadow: none;
  }
  90% {
    color: #484848;
    text-shadow: none;
  }
  100% {
    color: #fff900;
    text-shadow: 0 0 7px #fff900, 0 0 50px #ff6c00;
  }
}

li:nth-child(1) {
  animation-delay: .2s;
}
li:nth-child(2) {
  animation-delay: .4s;
}
li:nth-child(3) {
  animation-delay: .6s;
}
li:nth-child(4) {
  animation-delay: .8s;
}
li:nth-child(5) {
  animation-delay: 1s;
}
li:nth-child(6) {
  animation-delay: 1.2s;
}
li:nth-child(7) {
  animation-delay: 1.4s;
}
</style>
