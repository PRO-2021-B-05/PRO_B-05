<!-- Commentaires en dessous du template -->
<template>
  <div>
    <v-navigation-drawer app right clipped>
      <v-card-title class="mb-0">
        {{ info.title }}
      </v-card-title>
      <v-col cols="12" v-for="sect in info.section" :key="sect.id">
        <v-divider class="mx-4 my-4"></v-divider>
        <v-row class="mx-4 my-2">
          <div class="subtitle-1">{{ sect.title }}</div>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            fab
            small
            elevation="2"
            v-if="modify"
            @click="modifyDescription"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </v-row>
        <v-card-text class="pt-1">
          {{ sect.content }}
        </v-card-text>
      </v-col>
    </v-navigation-drawer>
    <ModifyDescription
      :overlay="overlay"
      :user="user"
      @close="overlay = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ModifyDescription from "@/components/ModifyDescription.vue";
import { Student } from "@/model/IStudent";

@Component({
  components: { ModifyDescription },
})

/**
 * Gère le composant NavInfo : la barre sur la droite de certaines pages affichant des informations
 */
export default class NavInfo extends Vue {
  @Prop({ default: false }) private info!: NavInfo;
  @Prop({ default: false }) private modify!: boolean;
  @Prop({
    default: {
      uuid: "",
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      description: "",
    },
  })
  private user!: Student;

  private overlay = false;

  /**
   * Affiche le formulaire pour modifier la description
   */
  public modifyDescription(): void {
    this.overlay = true;
  }
}
</script>

<style scoped></style>
