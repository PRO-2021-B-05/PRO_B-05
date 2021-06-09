<!-- Commentaires en dessous du template -->
<template>
  <v-overlay :value="overlay">
    <v-card color="white" light>
      <v-app-bar color="white" flat>
        <v-card-title> Modify Description </v-card-title>
      </v-app-bar>
      <v-form>
        <v-container>
          <v-col>
            <v-textarea
              v-model="descriptionText"
              label="Project Description"
              required
            />
            <v-row class="mt-2">
              <v-btn class="mr-2" outlined elevation="2" @click="close">
                <v-icon>mdi-close</v-icon>
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn color="primary" outlined elevation="2" @click="confirm">
                <v-icon>mdi-check</v-icon>
                Confirm
              </v-btn>
            </v-row>
          </v-col>
        </v-container>
      </v-form>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Student } from "@/model/IStudent";

@Component({
  components: {},
})

/**
 * Gère le composant Login : formulaire de modification de description
 */
export default class ModifyDescription extends Vue {
  @Prop({ default: false }) private overlay!: boolean;
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
  private descriptionText = "";

  /**
   * Gère la fermeture de l'overlay
   */
  public close(): void {
    this.$emit("close");
  }

  /**
   * confirme l'action
   */
  public async confirm(): Promise<void> {
    try {
      const response = await this.$api.modifyDescription(
        this.user.firstname,
        this.user.lastname,
        this.descriptionText
      );
      if (response.description != this.descriptionText) {
        this.$emit("updated");
      }
      this.$router.go(0);
      this.close();
    } catch (error) {
      console.log(error.response.data);
    }
  }

  /**
   * Prépare les données avant création du composant
   */
  public mounted(): void {
    this.descriptionText = this.user.description ?? "";
  }
}
</script>

<style scoped></style>
