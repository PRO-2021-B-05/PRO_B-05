<!-- Commentaires en dessous du template -->
<template>
  <div class="Admin">
    <v-container v-if="admin">
      <heading1> Admin </heading1>
      <v-breadcrumbs light />
      <v-container>
        <v-btn
          class="my-4 mx-4"
          color="primary"
          dark
          outlined
          elevation="2"
          @click="createUser"
        >
          <v-icon>mdi-plus</v-icon>
          Create User
        </v-btn>
        <v-container fluid v-if="!uuidsLoading">
          <v-data-iterator
            :items="students"
            item-key="username"
            :items-per-page.sync="itemsPerPage"
            :page.sync="page"
            :search="search"
            :sort-by="sortBy.toLowerCase()"
            :sort-desc="sortDesc"
            hide-default-footer
          >
            <template v-slot:header>
              <v-toolbar dark color="primary darken-1" class="mx-1 mb-4">
                <v-text-field
                  v-model="search"
                  dense
                  filled
                  solo-inverted
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  label="Search"
                  placeholder="Student Name"
                ></v-text-field>
              </v-toolbar>
            </template>
            <template v-slot:default="props">
              <v-row class="mx-0">
                <v-col
                  v-for="item in props.items"
                  :key="item.username"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  class="px-1 py-1"
                >
                  <v-card>
                    <v-card-text class="px-4 pt-2 pb-2">
                      <v-card-title class="px-0">
                        {{ item.lastname }} {{ item.firstname }}
                      </v-card-title>
                      <v-divider />
                      <v-container class="pt-0 pb-0">
                        <v-row class="py-4">
                          <div class="subtitle-1">{{ item.username }}</div>
                          <v-spacer />
                          <v-btn @click="deleteStudent(item.uuid)" icon small>
                            <v-icon> mdi-delete </v-icon>
                          </v-btn>
                          <v-btn @click="modifyUser(item)" icon small>
                            <v-icon> mdi-pencil </v-icon>
                          </v-btn>
                        </v-row>
                      </v-container>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <template v-slot:footer>
              <v-row
                v-if="numberOfPages > 1"
                class="mt-2 py-2 pt-2"
                align="center"
                justify="center"
              >
                <v-spacer></v-spacer>
                <span class="mr-4 grey--text">
                  Page {{ page }} of {{ numberOfPages }}
                </span>
                <v-btn
                  fab
                  dark
                  x-small
                  color="primary darken-2"
                  class="mr-1"
                  @click="formerPage"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  x-small
                  fab
                  dark
                  color="primary darken-2"
                  class="ml-1"
                  @click="nextPage"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-row>
            </template>
          </v-data-iterator>
        </v-container>
      </v-container>
    </v-container>
    <CRUD_User
      :crudAction="crudAction"
      :user="currentUser"
      :title="crudUser"
      :overlay="overlay"
      @close="overlay = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import Heading1 from "@/components/Heading1.vue";
import CRUD_User from "@/components/CRUD_User.vue";
import { Student } from "@/model/IStudent";

/**
 * Page Admin
 */
@Component({
  components: { Heading1, Header, CRUD_User },
})
export default class Admin extends Vue {
  private blankUser: Student = {
    uuid: "",
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    description: "",
  };
  private admin = false;
  private crudAction: "modify" | "create" = "modify";
  private currentUser = this.blankUser;
  private overlay = false;
  private crudUser = "";
  // --------------------- méthodes crud users ----------------------

  /**
   * Affiche le formulaire de création d'utilisateur
   */
  public createUser(): void {
    this.overlay = true;
    this.crudUser = "Create User";
    this.currentUser = this.blankUser;
    this.crudAction = "create";
  }
  /**
   * Affiche le formulaire de modification d'utilisateur
   */
  public modifyUser(user: Student): void {
    this.overlay = true;
    this.crudUser = "Modify User: " + user.username;
    this.currentUser = user;
    this.crudAction = "modify";
  }
  /**
   * attributs gérants la pagination
   */
  private uuidsLoading = true;
  private students: Student[] = [];
  private search = "";
  private sortDesc = false;
  private page = 1;
  private itemsPerPage = 20;
  private sortBy = "id";
  /**
   * renvoie le nombre de pages
   */
  get numberOfPages(): number {
    return Math.ceil(this.students.length / this.itemsPerPage);
  }
  /**
   * passer à la page suivante
   */
  public nextPage(): void {
    if (this.page + 1 <= this.numberOfPages) this.page += 1;
  }
  /**
   * passer à la page précédente
   */
  public formerPage(): void {
    if (this.page - 1 >= 1) this.page -= 1;
  }
  /**
   * rajout d'étudiant
   */
  public async getStudents(): Promise<void> {
    this.uuidsLoading = true;
    let pagination = await this.$api.getStudents(0, 1000);
    this.students = pagination.results;
    this.uuidsLoading = false;
  }
  /**
   * suppression d'étudiant
   */
  public async deleteStudent(uuid: string): Promise<void> {
    await this.$api.deleteStudent(uuid);
    this.$router.go(0);
  }
  /**
   * initialisation de la page, avec chargement de tous les étudiants
   */
  public async mounted(): Promise<void> {
    this.admin = await this.$api.isAdmin();
    if (!this.admin) {
      await this.$router.push({
        name: "ErrorPage",
      });
    } else {
      await this.getStudents();
    }
  }
}
</script>
