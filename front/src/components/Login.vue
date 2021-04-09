<template>
  <v-overlay
    :value = "overlay"
  >
    <v-card color="white" light>
      <v-app-bar color="white">
        <v-card-title>
          Log in
        </v-card-title>
      </v-app-bar>
      <v-form>
        <v-container>
          <v-col>
            <v-text-field
              label="Username"
            >

            </v-text-field>
            <v-text-field
              label="Password"
              type = "password"
            >

            </v-text-field>
            <v-row class="mt-2">
              <v-btn
                class="mr-2"
                outlined
                elevation="2"
                @click="close"
              >
                <v-icon>mdi-close</v-icon>
                cancel
              </v-btn>
              <v-spacer/>
              <v-btn
                color="primary"
                outlined
                elevation="2"
              >
                <v-icon>mdi-login</v-icon>
                Login
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
  components: { }
})
export default class Login extends Vue {
  @Prop({default : false }) private overlay! : boolean;
  close() {
    this.$emit('close');
  }
}
</script>

<style scoped>

</style>