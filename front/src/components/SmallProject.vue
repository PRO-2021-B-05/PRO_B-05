<template>
  <v-card
    :href="`/project/${project.uuid}`"
    elevation="hover? 12 2"
    hover="hover"
  >
    <v-img height="250" :src="thumbnailURL" />
    <v-container class="px-1 py-4">
      <v-card-title href="/project" class="py-0 text--primary">
        {{ project.title }}
      </v-card-title>
      <v-btn
        :href="`/profil/${project.userId}`"
        small
        text
        class="px-4"
        v-if="authorDisplay"
      >
        by {{ project.firstname }} {{ project.lastname }}
      </v-btn>
      <div v-if="descriptionDisplay">
        <v-card-text>
          {{ project.description }}
        </v-card-text>
      </div>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IProject } from "@/model/IProject";

@Component({
  components: {},
})
export default class SmallProject extends Vue {
  @Prop({ required: true }) private project?: IProject;
  @Prop({ default: false }) private authorDisplay!: boolean;
  @Prop({ default: false }) private descriptionDisplay!: boolean;
  private thumbnailURL? = "";
  public async mounted(): Promise<void> {
    const images = await this.$api.getProjectImages(this.project?.uuid);
    if (images.length) {
      this.thumbnailURL = images[0].thumbnailUrl;
    }
  }
}
</script>
