<template>
  <v-container>
    <!-- 中央寄せ -->
    <v-container mt-6 mb-13>
      <v-row algin="center" justify="center">
        <div align="left">
          <a
            v-text="post.user.name"
            :href="`https://twitter.com/` + post.user.nickname"
            class="text-h6"
          ></a>
        </div>
        <p class="text-h6" align="left">さんの</p>
      </v-row>
      <v-row algin="center" justify="center" class="mt-0 mb-5">
        <div v-text="post.hash_tag" class="text-h4" />
      </v-row>
      <v-row algin="center" justify="center">
        <v-card height="45%" width="45%">
          <v-img
            :src="post.image"
            :lazy-src="post.image"
            aspect-ratio="1"
            class="rounded-0"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-row>
    </v-container>

    <!-- 中央寄せ -->
    <v-container justify="center" alignt="center">
      <v-row algin="center" justify="center">
        <v-col cols="6" xs="12" justify="center">
          <v-list>
            <template v-for="(album, index) in post.albums">
              <v-header class="pl-5">
                <!-- <span>{{ index + 1 }}</span> -->
                <!-- <span ml-0 pl-0>. </span> -->
                <span class="text-h6">{{ album.name }}</span>
              </v-header>

              <v-list-item selectable two-line>
                <v-list-item-avatar tile height="30%" width="30%">
                  <v-img :src="album.images[0].url" />
                </v-list-item-avatar>
                <!-- <v-divider vertical class="my-4"></v-divider> -->
                <v-list-item-content>
                  <!-- <v-list-item-title 
                    class="ml-4 mt-0 pt-0"
                  >
                    <span class="text-h2xl leading-7 font-semibold">{{ album.name }}</span>
                  </v-list-item-title> -->

                  <span class="caption text--secondary ml-4">{{
                    post.dates[index]
                  }}</span>
                  <div class="mt-4 mb-0"></div>

                  <v-list-item-title
                    v-text="album.artists[0].name"
                    class="ml-4 mt-1 pt-0"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="index !== 8" class="mt-7 mb-3"></v-divider>
            </template>
          </v-list>
        </v-col>
      </v-row>
    </v-container>

    <!-- <v-container
      v-for="album in post.albums"
      :key="album.id"
      ma-3 
      justify="center"
      align="center"
    >
      <v-row no-gutters>
        <v-col cols="3" >
          <v-img
            :src="album.images[0].url"
            :lazy-src="album.images[0].url"
            :alt="album.name"
            aspect-ratio="1"
            height="100%"
            width="100%"
            class="ma-2 mb-0 rounded-0"
          >

            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="green lighten-3"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      
        <v-col class="3">
          <v-card-text class="pt-3 pb-0">
            <p class="body-2 font-weight-bold ma-0 text-truncate white--text">
              {{ album.name }}
            </p>
            <p class="caption font-weight-light mb-0 text-truncate">
              {{ album.artists[0].name }}
            </p>
          </v-card-text>
        </v-col>
      </v-row>

      <v-divider
      ></v-divider>

    </v-container> -->

    <!-- <v-col
        v-for="album in post.albums"
        :key="album.id"
        ma-3 
        justify="center"
        align="center"
      >
        <v-card
          flat
          class="pa-0"
          height="100%"
          width="75%"
        >
          <div class="d-flex flex-no-wrap">
 
              <v-img 
                :src="album.images[0].url"
                width="20%"
                height="20%"
                ></v-img>
            
            <div>
              <v-card-title
                class="text-h6"
                align="left"
                v-text="album.name"
              ></v-card-title>
              <v-card-subtitle v-text="album.artists[0].name" align="left" class="text-h7 caption"></v-card-subtitle>
              <v-card-actions>
                  <v-btn
                    class="ml-2 mt-3"
                    fab
                    icon
                    height="40px"
                    right
                    width="40px"
                  >
                    <v-icon>mdi-play</v-icon>
                  </v-btn>
              </v-card-actions>
            </div>
          </div>
        </v-card>
      </v-col> -->
  </v-container>
</template>

<script>
import { axios } from "@/plugins/axios";

export default {
  async asyncData(context) {
    const data = await axios.$get("/api/v1/posts/" + context.params.id);
    return { post: data };
  },
  head() {
    return {
      title: this.post.user.name + "さんの " + this.post.hash_tag,
      titleTemplate: "",
    };
  },
};
</script>
