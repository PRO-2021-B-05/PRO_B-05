<!-- Commentaires en dessous du template -->
<template>
  <v-container>
    <Heading1>Create Project</Heading1>
    <ProjectForm :modify="false"></ProjectForm>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Heading1 from "@/components/Heading1.vue";
import ProjectForm from "@/components/ProjectForm.vue";

@Component({
  components: { ProjectForm, Heading1 },
})
/**
 * Page de la création de projet
 */
export default class CreateProject extends Vue {}
</script>

<style></style>
