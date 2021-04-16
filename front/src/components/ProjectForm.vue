<template>
  <v-row>
    <v-col>
      <v-container>
        <v-row>
          <v-col xs="12" sm="6">
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
          </v-col>
          <v-col xs="12" sm="6">
            <v-container>
              <v-row>
                <v-file-input
                  v-model="tmpFiles"
                  @change="load"
                  multiple
                  label="Images"
                  accept="image/*"
                  prepend-icon="mdi-image-outline"
                ></v-file-input>
              </v-row>
              <v-row
                v-for="image in images"
                :key="image.src"
                class="d-flex justify-center"
              >
                <v-card class="my-1 pa-0">
                  <v-row>
                    <v-col xs="12" sm="4" lg="3">
                      <v-card class="pa-0">
                        <v-img :src="image.src" height="75px"> </v-img>
                      </v-card>
                    </v-col>
                    <v-col xs="11" sm="6" lg="7">
                      <v-text-field label="Image title"></v-text-field>
                    </v-col>
                    <v-col cols="2" class="d-flex justify-center">
                      <div class="d-flex flex-column justify-center">
                        <v-btn
                          @click="deleteImage(image)"
                          outlined
                          color="error"
                          fab
                          x-small
                        >
                          <v-icon>mdi-delete-outline</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-divider class="mb-6" />
        <v-row>
          <v-spacer />
          <v-btn color="primary" outlined>
            <v-icon>mdi-folder-plus-outline</v-icon>
            Create
          </v-btn>
          <v-spacer />
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ImageLoader from "@/components/ImageLoader.vue";

type ImageObj = { file: File; src: string; description?: string };

@Component({
  components: { ImageLoader },
})
export default class ProjectForm extends Vue {
  test: File | null = null;
  projectName: string | null = null;
  projectDescription: string | null = null;
  tmpFiles: File[] = [];
  images: ImageObj[] = [];

  load(imagesLoaded: File[]) {
    const filteredFiles = imagesLoaded.filter((image) => {
      return (
        image && (image.type === "image/png" || image.type === "image/jpeg")
      );
    });
    const mappedFiles = filteredFiles.map((image) => {
      return { file: image, src: URL.createObjectURL(image) };
    });
    this.images.push(...mappedFiles);
    this.tmpFiles = [];
  }

  deleteImage(image: ImageObj) {
    const index = this.images.findIndex((i) => i === image);
    this.images.splice(index, 1);
    URL.revokeObjectURL(image.src);
  }

  destroy() {
    this.images.forEach((image) => {
      URL.revokeObjectURL(image.src);
    });
  }
}
</script>

<style scoped></style>
