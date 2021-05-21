<template>
  <v-card elevation="hover? 12 2" hover="hover">
    <v-card flat class="px-0 py-0" :href="`/project/${project.uuid}`">
      <v-img height="250" :src="thumbnailURL" />
      <v-card-title class="py-0 text--primary">
        {{ project.title }}
      </v-card-title>
      <v-btn
        :href="`/profil/${project.student.uuid}`"
        small
        text
        class="px-4"
        v-if="authorDisplay"
      >
        by {{ project.student.firstname }} {{ project.student.lastname }}
      </v-btn>
      <div v-if="descriptionDisplay">
        <v-card-text>
          {{ project.description }}
        </v-card-text>
      </div>
    </v-card>
    <v-card flat class="px-1 pb-4" v-if="modify">
      <v-btn
        text
        color="warning"
        small
        :href="`/modifyProject/${project.uuid}`"
      >
        <v-icon>mdi-pencil</v-icon>
        Modify Project
      </v-btn>
      <v-btn @click="deleteProject" text color="error" small>
        <v-icon>mdi-delete-outline</v-icon>
        Delete Project
      </v-btn>
    </v-card>
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
  @Prop({ default: false }) private modify!: boolean;
  private thumbnailURL? = "";
  public async updateImages(): Promise<void> {
    this.thumbnailURL = this.project?.thumbnailUrl;
    /*const images = await this.$api.getProjectImages(this.project?.uuid);
    if (images.length) {
      this.thumbnailURL = images[0].thumbnailUrl;
    } else {
      this.thumbnailURL = "";
    }*/
  }
  public async beforeUpdate(): Promise<void> {
    await this.updateImages();
  }
  public async mounted(): Promise<void> {
    await this.updateImages();
  }
  public async deleteProject(): Promise<void> {
    if (!this.project) return;
    if (!this.project.userId) return;
    await this.$api.sendDeleteProject(this.project.uuid);
    this.$emit("delete");
  }
}
</script>
<style>
a {
  text-decoration: none;
  color: black;
}
</style>
