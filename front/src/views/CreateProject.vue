<template>
  <v-container>
    <Heading1 :modify="false">Create Project</Heading1>
    <ProjectForm></ProjectForm>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Heading1 from "@/components/Heading1.vue";
import ProjectForm from "@/components/ProjectForm.vue";

@Component({
  components: { ProjectForm, Heading1 },
})
export default class CreateProject extends Vue {}
</script>

<style></style>
