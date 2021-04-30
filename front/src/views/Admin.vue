<template>
  <div class="Admin">
    <v-container>
      <heading1> Admin </heading1>
      <v-breadcrumbs light />
      <v-card>
        <v-btn
          class="my-3 mx-3"
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
              <v-toolbar dark color="primary darken-1" class="mb-1">
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
                <template v-if="$vuetify.breakpoint.mdAndUp">
                  <v-spacer></v-spacer>
                  <v-btn-toggle v-model="sortDesc" mandatory>
                    <v-btn large depressed color="primary" :value="false">
                      <v-icon>mdi-arrow-up</v-icon>
                    </v-btn>
                    <v-btn large depressed color="primary" :value="true">
                      <v-icon>mdi-arrow-down</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </template>
              </v-toolbar>
            </template>

            <template v-slot:default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item.username"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card>
                    <v-card-text class="px-4 pt-2 pb-2">
                      <v-card-title>
                        {{ item.firstname }} {{ item.lastname }}
                      </v-card-title>
                      <v-divider />
                      <v-list dense>
                        <v-list-item
                          dense
                          v-for="(key, index) in filteredKeys"
                          :key="index"
                        >
                          <v-list-item-content
                            :class="{ 'primary--text small': sortBy === key }"
                          >
                            {{ key }} : {{ item[key.toLowerCase()] }}
                          </v-list-item-content>
                        </v-list-item>
                        <v-container class="pt-0 pb-0 text-right">
                          <v-btn @click="deleteStudent(item.uuid)" icon>
                            <v-icon> mdi-delete </v-icon>
                          </v-btn>
                          <v-btn @click="modifyUser(item)" icon>
                            <v-icon> mdi-pencil </v-icon>
                          </v-btn>
                        </v-container>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <template v-slot:footer>
              <v-row
                v-if="numberOfPages > 1"
                class="mt-2"
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
                  color="primary darken-2"
                  class="mr-1"
                  @click="formerPage"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
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
      </v-card>
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
import { UserAPI } from "@/model/IUserAPI";
import { Student } from "@/model/IStudent";

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
  private crudAction: "modify" | "create" = "modify";
  private currentUser = this.blankUser;
  private infos?: UserAPI = undefined;
  private overlay = false;
  private crudUser = "";
  public createUser(): void {
    this.overlay = true;
    this.crudUser = "Create User";
    this.currentUser = this.blankUser;
    this.crudAction = "create";
  }
  public modifyUser(user: Student): void {
    this.overlay = true;
    this.crudUser = "Modify User: " + user.username;
    this.currentUser = user;
    this.crudAction = "modify";
  }
  private uuidsLoading = true;
  private usersLoading = true;
  private uuids?: { uuid: string }[] | null;
  private students: Student[] = [];
  private keys = ["username", "firstname", "lastname"];
  private search = "";
  private sortDesc = false;
  private page = 1;
  private itemsPerPage = 24;
  private sortBy = "id";
  public get filteredKeys(): string[] {
    return this.keys.filter((key) => key !== "name");
  }
  get numberOfPages(): number {
    return Math.ceil(this.students.length / this.itemsPerPage);
  }
  public nextPage(): void {
    if (this.page + 1 <= this.numberOfPages) this.page += 1;
  }
  public formerPage(): void {
    if (this.page - 1 >= 1) this.page -= 1;
  }
  public async getStudentsUuids(): Promise<void> {
    this.uuidsLoading = true;
    this.uuids = await this.$api.getStudentsUuid();
    this.uuidsLoading = false;
  }
  public async getStudents(): Promise<void> {
    this.usersLoading = true;
    if (this.uuids && this.uuids.length > 0) {
      console.log("nb students : " + this.uuids.length);
      for (let i = 0; i < this.uuids.length; ++i) {
        this.students.push(...[await this.$api.getStudent(this.uuids[i].uuid)]);
      }
    }
    this.usersLoading = false;
  }
  public async deleteStudent(): Promise<void> {
    await this.$api.deleteStudent(this.currentUser.uuid);
  }
  public async mounted(): Promise<void> {
    await this.getStudentsUuids();
    await this.getStudents();
  }
}
</script>
