<template>
  <v-container>
    <Heading1>Modify Project</Heading1>
    <ProjectForm :modify="true" :projectUuid="$route.params.uuid"></ProjectForm>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Heading1 from "@/components/Heading1.vue";
import ProjectForm from "@/components/ProjectForm.vue";

@Component({
  components: { ProjectForm, Heading1 },
})
export default class ModifyProject extends Vue {}
</script>

<style></style>
