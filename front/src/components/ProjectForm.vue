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
        </v-form>
        <div>Res : {{}}</div>
      </v-card>
    </v-col>
    <v-col xs="12" sm="6">
      <v-card class="pa-4">
        <v-file-input
          @change="load"
          multiple
          label="Images"
          accept="image/*"
          prepend-icon="mdi-image-outline"
        ></v-file-input>
        <v-container>
          <v-row>
            <v-col col="3" v-for="image in images" :key="image.src">
              <v-card>
                <v-img
                 @click="deleteImage(image)"
                  :src="image.src"
                  height="100px"
                ></v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-text-field label="Image title"></v-text-field>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ImageLoader from "@/components/ImageLoader.vue";

type ImageObj = {file : File, src : string };

@Component({
  components: { ImageLoader },
})
export default class ProjectForm extends Vue {
  test: File | null = null;
  projectName: string | null = null;
  projectDescription: string | null = null;

  images: ImageObj[] = [];

  load(imagesLoaded: File[]) {
    const filteredFiles = imagesLoaded.filter((image) => {
      return (
        image && (image.type === "image/png" || image.type === "image/jpeg")
      );
    }).map(image => {
      return (
        {file: image, src : URL.createObjectURL(image)}
      );
    })
    this.images.push(...filteredFiles);
  }

  deleteImage(image: ImageObj){
    const index = this.images.findIndex(i => i === image);
    this.images.splice(index, 1);
    URL.revokeObjectURL(image.src);
  }

  destroy() {
    this.images.forEach(image => {
      URL.revokeObjectURL(image.src);
    })
  }
}
</script>

<style scoped></style>
