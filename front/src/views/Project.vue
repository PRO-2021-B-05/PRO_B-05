<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-carousel
            v-if="images"
            v-model="model"
            hide-delimiter-background
            show-arrows-on-hover
          >
            <v-carousel-item v-for="(image, id) in images" :key="id">
              <v-img contain :src="image.url" height="100%"> </v-img>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <div v-if="images[model]" class="subtitle-2 text-center">
            {{ images[model].title }}
          </div>
        </v-col>
      </v-row>
      <v-divider class="mb-4 mt-8" />
      <div v-if="projectInfo" class="d-lg-none">
        <v-row>
          <v-col>
            <div v-if="projectInfo.title" class="title text-center">
              {{ projectInfo.title }}
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <v-row v-if="projectInfo.section">
          <v-col v-for="sect in projectInfo.section" :key="sect.id" xs="12">
            <div class="subtitle-1 text-center">{{ sect.title }}</div>
            <div class="text-center">{{ sect.content }}</div>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <NavInfo v-if="projectInfo" :info="projectInfo" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import NavInfo from "@/components/NavInfo.vue";
import { INavInfo } from "@/model/INavInfo";
import { IProject } from "@/model/IProject";
import { Image } from "@/model/IImage";

@Component({
  components: {
    NavInfo,
  },
})
export default class Project extends Vue {
  private uuid?: string;
  private model = 0;
  private project?: IProject;
  private projectInfo: INavInfo | null = null;
  private images: Image[] = [];

  public async getProject(): Promise<void> {
    this.project = await this.$api.getProject(this.uuid);
    this.projectInfo = {
      title: this.project?.title,
      section: [
        {
          id: 1,
          title: "description",
          content: this.project?.description,
        },
      ],
    };
  }

  public async getImages(): Promise<void> {
    this.images = await this.$api.getProjectImages(this.uuid);
    console.log(this.images[0].url);
  }

  public async mounted(): Promise<void> {
    this.uuid = this.$route.params.uuid;
    await this.getProject();
    await this.getImages();
  }
}
</script>

<style scoped></style>
