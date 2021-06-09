<!-- Commentaires en dessous du template -->
<template>
  <v-overlay :value="overlay">
    <v-card color="white" light>
      <v-app-bar color="white" flat>
        <v-card-title> {{ title }} </v-card-title>
      </v-app-bar>
      <v-form>
        <v-container>
          <v-col>
            <v-text-field label="First Name" v-model="user.firstname" />
            <v-text-field label="Last Name" v-model="user.lastname" />
            <v-text-field
              label="Password"
              type="password"
              v-model="user.password"
            />
            <v-text-field
              label="Confirm Password"
              type="password"
              v-model="passwordConfirm"
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
 * Gère le composant CRUD_User : un formulaire html permettant de créer et modifier un utilisateur
 */
export default class CRUD_User extends Vue {
  private passwordConfirm = "";
  @Prop({ default: false }) private overlay!: boolean;
  /**
   * indique quelle type d'action on veut effectuer
   */
  @Prop({ default: null }) private crudAction?: "modify" | "create";
  @Prop({ default: "Create User" }) private title!: string;
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
  /**
   * fermer le composant overlay
   */
  public close(): void {
    this.$emit("close");
  }

  /**
   * confirme l'action de l'overlay
   * si l'action est acceptée, on ferme l'overlay
   * deux actions possibles : modify ou create
   */
  public async confirm(): Promise<void> {
    try {
      if (this.crudAction != null) {
        switch (this.crudAction) {
          case "create":
            await this.$api.sendCreateStudent(this.user);
            break;
          case "modify":
            await this.$api.sendModifyStudent(this.user);
            break;
        }
      }
      this.close();
    } catch (error) {
      console.log(error.response.data);
    }
  }
}
</script>

<style scoped></style>
