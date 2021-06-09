<!-- Commentaires en dessous du template -->
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
      <v-btn text color="warning" small :to="`/modifyProject/${project.uuid}`">
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
/**
 * Gère l'affichage des projets sur les pages Discover et profil
 */
export default class SmallProject extends Vue {
  @Prop({ required: true }) private project?: IProject;
  @Prop({ default: false }) private authorDisplay!: boolean;
  @Prop({ default: false }) private descriptionDisplay!: boolean;
  @Prop({ default: false }) private modify!: boolean;
  private thumbnailURL? = "";

  /**
   * Mets à jour les images lorsque le composant est construit
   */
  public async updateImages(): Promise<void> {
    this.thumbnailURL = this.project?.thumbnailUrl;
  }

  /**
   * initialisation du composant en chargeant toutes les images
   */
  public async beforeUpdate(): Promise<void> {
    await this.updateImages();
  }

  /**
   * initialisation du composant en chargeant toutes les images
   */
  public async mounted(): Promise<void> {
    await this.updateImages();
  }

  /**
   * suppression du projet
   */
  public async deleteProject(): Promise<void> {
    if (!this.project) return;
    if (!this.project.student.uuid) return;
    await this.$api.sendDeleteProject(this.project.uuid);
    this.$emit("delete");
  }
}
</script>
