<!-- Commentaires en dessous du template -->
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
                      <v-text-field
                        label="Image title"
                        v-model="image.title"
                      ></v-text-field>
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
        <v-row class="mb-2">
          <v-spacer />
          <div class="subtitle-1 red--text" v-if="error">
            Error : Title, description or image files are missing.
          </div>
          <v-spacer />
        </v-row>
        <v-row>
          <v-spacer />
          <v-btn color="primary" outlined @click="sendProject">
            <v-icon>mdi-folder-plus-outline</v-icon>
            {{ crudText }}
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

@Component({
  components: {},
})
/**
 * Gère le composant ProjectForm : formulaire qui créeou modifie les projets
 */
export default class ProjectForm extends Vue {
  @Prop({ default: false }) private modify!: boolean;
  @Prop({ default: "" }) private projectUuid!: string;
  private crudText: "Modify" | "Create" = "Modify";
  private projectName = "";
  private projectDescription = "";
  //ancien trucs images qui ne sont plus utilisés
  private tmpFiles: File[] = [];
  private imagesToDelete: Image[] = [];
  private images: Image[] = [];
  private error = false;

  // ------------------------------ méthodes -----------------------------
  /**
   * load les images à partir de l'explorateur de fichier local
   */
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

  /**
   * supprime les images chargé dans le navigateur
   */
  public deleteImage(image: Image): void {
    if (image.uuid) {
      this.imagesToDelete.push(image);
    }
    URL.revokeObjectURL(image.url);
    this.images = this.images.filter((i) => i !== image);
  }

  /**
   * suppression l'URL créé par le navigateur pour une image
   */
  public destroy(): void {
    this.images.forEach((image) => {
      URL.revokeObjectURL(image.url);
    });
  }

  /**
   * envoyer un projet
   * si on est dans l'état modify, alors on supprime les images supprimées et
   * on envoie les nouvelles
   */
  public async sendProject(): Promise<void> {
    if (
      this.projectDescription != "" &&
      this.projectName != "" &&
      this.images.length > 0
    ) {
      if (this.modify) {
        await this.modifyProject();
      } else {
        await this.createProject();
      }
      await this.$router.push({
        name: "Project",
        params: {
          uuid: this.projectUuid,
        },
      });
    } else {
      this.error = true;
    }
  }

  /**
   * envoyer unde demande de suppression d'images
   */
  private async sendDeleteImagesToServer(projectUuid: string): Promise<void> {
    console.log(this.images);
    for (const image of this.imagesToDelete) {
      await this.$api.deleteImage(projectUuid, image.uuid);
    }
    for (const image of this.images) {
      if (!image.file) continue;
      await this.$api.sendImage(projectUuid, {
        file: image.file,
        title: image.title ?? "",
      });
    }
  }

  /**
   * envoyer une demande de création de projet
   */
  private async createProject(): Promise<void> {
    const userUUID = (await this.$api.getMyProfile()).uuid;
    const createdProjectUUID = await this.$api.sendCreateProject(userUUID, {
      title: this.projectName,
      description: this.projectDescription,
    });
    await this.sendDeleteImagesToServer(createdProjectUUID);
    this.projectUuid = createdProjectUUID;
  }

  /**
   * envoyer une demande de modification du projet
   */
  private async modifyProject(): Promise<void> {
    await this.$api.sendModifyProject(this.projectUuid, {
      title: this.projectName,
      description: this.projectDescription,
    });
    // send new
    await this.sendDeleteImagesToServer(this.projectUuid);
  }

  /**
   * initialiser le composant dans le bon état
   */
  public async mounted(): Promise<void> {
    if (this.modify) {
      this.crudText = "Modify";
      const project = await this.$api.getProject(this.projectUuid);
      this.projectName = project.title;
      this.projectDescription = project.description;
      let pagination = await this.$api.getProjectImages(
        this.projectUuid,
        0,
        200
      );
      const images = pagination.results;
      // obtenir les images
      this.images.push(...images);
    } else {
      this.crudText = "Create";
    }
  }
}
</script>
