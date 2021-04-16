<template>
  <v-card
    @drop.prevent="addFile"
    @dragover.prevent
    width="100"
    height="100"
    class="d-flex justify-center align-center fill-height"
    flat
  >
    <v-img v-if="src" :src="src" class="fill-height" />
    <v-icon v-else size="100">mdi-file-image</v-icon>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Upload extends Vue {
  src: string | null = null;

  @Prop() value: File | null = null;

  @Watch("value") valueChanged(value: any) {
    URL.revokeObjectURL(this.src ?? "");
    if (!value) return (this.src = null);
    this.src = URL.createObjectURL(value);
  }

  async addFile(e: DragEvent) {
    const file = e.dataTransfer?.files.item(0);
    if (!file || !(file.type === "image/png" || file.type === "image/jpeg"))
      return;
    this.$emit("input", file);
  }

  destroy() {
    URL.revokeObjectURL(this.src ?? "");
  }
}
</script>
