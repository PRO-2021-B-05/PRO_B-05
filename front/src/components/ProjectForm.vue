<template>
  <v-row>
    <v-col xs="12" sm="6">
      <v-card class="pa-4">
        <v-form>
          <v-text-field
            v-model="projectName"
            label="Project Name"
            required
          ></v-text-field>
          <v-textarea
            v-model="projectDescription"
            label="Project Description"
            required
          ></v-textarea>
          <v-file-input
            label="Images of the projects"
            accept="image/*"
          ></v-file-input>
        </v-form>
      </v-card>
    </v-col>
    <v-col xs="12" sm="6">
      <v-card class="pa-4">
        <Upload></Upload>
        <v-text-field
          label="Image title"
        ></v-text-field>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Upload from "@/components/Upload.vue";

@Component({
  components: { Upload },
})
export default class ProjectForm extends Vue {

}
</script>

<style scoped>

</style>