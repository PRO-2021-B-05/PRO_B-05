<!-- Commentaires en dessous du template -->
<template>
  <v-row>
    <v-col xs="2" md="4">
      <v-divider class="my-6"></v-divider>
    </v-col>
    <v-col xs="8" md="4">
      <h1 class="text-center">
        <slot></slot>
      </h1>
    </v-col>
    <v-col xs="2" md="4">
      <v-divider class="my-6"></v-divider>
    </v-col>
  </v-row>
</template>

<script>
/**
 * Composant des titres de chaque page
 */
export default {
  name: "Heading1",
};
</script>

<style scoped></style>
