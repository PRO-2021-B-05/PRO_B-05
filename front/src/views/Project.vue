<template>
  <div>
    <v-container>
      <v-row>
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
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <div class="subtitle-2 text-center">{{ images[model].title }}</div>
        </v-col>
      </v-row>
      <v-divider class="mb-4 mt-8" />
      <div class="d-lg-none">
        <v-row>
          <v-col>
            <div class="title text-center">{{ ProjectInfo.title }}</div>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <v-row>
          <v-col v-for="sect in ProjectInfo.section" :key="sect.id" xs="12">
            <div class="subtitle-1 text-center">{{ sect.title }}</div>
            <div class="text-center">{{ sect.content }}</div>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <NavInfo :info="ProjectInfo" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import NavInfo from "@/components/NavInfo.vue";
import { INavInfo } from "@/model/INavInfo";
@Component({
  components: {
    NavInfo,
  },
})
export default class Project extends Vue {
  private ProjectInfo: INavInfo = {
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
