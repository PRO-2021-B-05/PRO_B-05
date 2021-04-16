<template>
  <v-overlay :value="overlay">
    <v-card color="white" light>
      <v-app-bar color="white" flat>
        <v-card-title> {{ title }} </v-card-title>
      </v-app-bar>
      <v-form>
        <v-container>
          <v-col>
            <v-text-field label="First Name" />
            <v-text-field label="Last Name" />
            <v-text-field label="Password" type="password" />
            <v-text-field label="Confirm Password" type="password" />
            <v-row class="mt-2">
              <v-btn class="mr-2" outlined elevation="2" @click="close">
                <v-icon>mdi-close</v-icon>
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn color="primary" outlined elevation="2" @click="confirm">
                <v-icon>mdi-yes</v-icon>
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

@Component({
  components: {},
})
export default class CRUD_User extends Vue {
  @Prop({ default: false }) private overlay!: boolean;
  @Prop({ default: "Create User" }) private title!: string;
  public close(): void {
    this.$emit("close");
  }
  public confirm(): void {
    //todo
    this.close();
  }
}
</script>

<style scoped></style>
