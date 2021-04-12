<template>
  <v-container>
    <v-col>
      <v-carousel
        v-model="model"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item v-for="image in images" :key="image.id">
          <v-img contain :src="image" height="100%"> </v-img>
        </v-carousel-item>
      </v-carousel>
      <v-divider class="my-4" />
      <div class="title text-center">{{ images[model].title }}</div>
      <NavInfo :info="ProjectInfo"/>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Header from "@/components/Header.vue";
import Discover from "@/views/Discover.vue";
import NavInfo from "@/components/NavInfo.vue";
@Component({
  components: {
    NavInfo,
  },
})
export default class Project extends Vue {
  private ProjectInfo = {
    title: "Project Name",
    section: [
      {
        id: 1,
        title: "Description",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus, purus sed luctus porta, libero arcu tincidunt dolor, nec ullamcorper turpis mi ut ipsum. Donec ac eros pulvinar, dapibus nisi vel, molestie ligula. ",
      },
    ],
  };

  model = 0;
  images = [
    {
      id: 1,
      title: "Image Title 1",
      src:
        "https://i.pinimg.com/originals/ad/84/a5/ad84a52f49126f41ce0b537edb6d7770.jpg",
    },
    {
      id: 2,
      title: "Image Title 2",
      src:
        "https://static.wikia.nocookie.net/bakemonogatari1645/images/a/ab/Yotsugi_profile.jpg",
    },
    {
      id: 3,
      title: "Image Title 3",
      src:
        "https://static.wikia.nocookie.net/nisioisin/images/9/97/YotsugiOnonoki_anime.png",
    },
  ];
}
</script>

<style scoped></style>
