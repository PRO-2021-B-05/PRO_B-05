<!-- Commentaires en dessous du template -->
<template>
  <v-container>
    <heading1>Error</heading1>
    <v-row>
      <v-spacer />
      <div class="subtitle-1 text-center">You can't access this page</div>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import Heading1 from "@/components/Heading1.vue";

/**
 * Page d'erreur
 */
@Component({ components: { Heading1, Header } })
export default class ErrorPage extends Vue {}
</script>

<style scoped></style>
