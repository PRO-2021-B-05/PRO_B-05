<template>
  <v-row>
    <v-col>
      <v-container>
        <v-row>
          <v-col cols="12" xs="12" md="6">
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
          <v-col cols="12" xs="12" md="6">
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
                :key="image.url"
                class="d-flex justify-center"
              >
                <v-card class="my-1 pa-0 d-none d-sm-block">
                  <v-row>
                    <v-col sm="3" md="4" lg="3">
                      <v-card class="pa-0" elevation="0">
                        <v-img :src="image.url" height="75px"></v-img>
                      </v-card>
                    </v-col>
                    <v-col sm="7" md="5" lg="7" class="pr-0">
                      <v-text-field label="Image title"></v-text-field>
                    </v-col>
                    <v-col sm="2" md="3" lg="2" class="d-flex justify-center">
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
                <v-card class="my-1 pa-0 d-sm-none">
                  <v-container>
                    <v-row>
                      <v-img :src="image.url" height="150px"></v-img>
                    </v-row>
                  </v-container>
                  <v-container>
                    <v-row>
                      <v-col cols="9" class="pr-0">
                        <v-text-field label="Image title"></v-text-field>
                      </v-col>
                      <v-col cols="3" class="d-flex justify-center">
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
                  </v-container>
                </v-card>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-divider class="mb-6" />
        <v-row>
          <v-spacer />
          <v-btn color="primary" outlined @click="sendProject">
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
import { Image } from "@/model/IImage";

interface ImageObj extends Image {
  uuid?: string; // j'existe en db
  file?: File; // dois etre ajouter
}

@Component({
  components: {},
})
export default class ProjectForm extends Vue {
  @Prop({ default: false }) private modify!: boolean;
  @Prop({ default: "" }) private projectUuid!: string;
  private crudText: "Modify" | "Create" = "Modify";
  private projectName?: string;
  private projectDescription?: string;
  //ancien trucs images qui ne sont plus utilisés
  private tmpFiles: File[] = [];
  //
  private imagesToDelete: ImageObj[] = [];
  private images: ImageObj[] = [];

  // ------------------------------ méthodes -----------------------------
  public load(imagesLoaded: File[]): void {
    const filteredFiles = imagesLoaded.filter(
      (image) =>
        image && (image.type === "image/png" || image.type === "image/jpeg")
    );
    const mappedFiles = filteredFiles.map((image) => ({
      file: image,
      url: URL.createObjectURL(image),
    }));
    this.images.push(...mappedFiles);
    this.tmpFiles = [];
  }

  public deleteImage(image: ImageObj): void {
    if (image.uuid) {
      this.imagesToDelete.push(image);
    }
    URL.revokeObjectURL(image.url);
    this.images = this.images.filter((i) => i !== image);
  }

  public destroy(): void {
    this.images.forEach((image) => {
      URL.revokeObjectURL(image.url);
    });
  }

  public sendProject(): void {
    if (this.modify) {
      this.modifyProject();
    } else {
      this.createProject();
    }
  }

  private sendDeleteImagesToServer(projectUuid: string) {
    this.imagesToDelete.forEach((image) => {
      this.$api.deleteImage(projectUuid, image.uuid);
    });
    this.images.forEach((image) => {
      if (!image.file) return;
      this.$api.sendImage(projectUuid, {
        file: image.file,
        title: image.title,
      });
    });
  }

  private async createProject(): Promise<void> {
    const createdProjectUUID = await this.$api.sendCreateProject(
      this.userUUID,
      {
        title: this.projectName,
        description: this.projectDescription,
      }
    );
    this.sendDeleteImagesToServer(createdProjectUUID);
  }

  private async modifyProject(): Promise<void> {
    await this.$api.sendModifyProject(this.projectUuid, {
      title: this.projectName,
      description: this.projectDescription,
    });
    // send new
    this.sendDeleteImagesToServer(this.projectUuid);
  }

  public async mounted(): Promise<void> {
    if (this.modify) {
      // obtenir les images
      this.images.push(...images);
    } else {
      this.crudText = "Create";
    }
  }
}
</script>
