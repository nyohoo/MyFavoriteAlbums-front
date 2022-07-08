<template>
 <div class="login">
  <p
  v-if="user.login"
  class="text"
  >
  {{ user }}
  </p>
  <form
  v-else
  class="form"
  @submit.prevent
  >
   <v-btn
     class="button"
     type="submit"
     @click="loginTwitter"
   >
     twitterでログイン
   </v-btn>
  </form>
 </div>
</template>

<script>
export default {
 computed: {
  user () {
   return this.$store.getters['user']
  },
 },
 methods : {
  loginTwitter () {
   this.$store.dispatch('loginTwitter')
  },
 }
}
</script>