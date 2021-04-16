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
        <v-container fluid v-if="students">
          <v-data-iterator
            :items="students"
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
                  :key="item.name"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card flat>
                    <v-content class="px-4 pt-2 pb-2">
                      <v-list dense>
                        <v-list-item dense>
                          <v-list-item-content>
                            {{ item.name }}
                          </v-list-item-content>
                          <v-list-item-content>
                            <v-container class="pt-0 pb-0">
                              <v-btn icon>
                                <v-icon> mdi-delete </v-icon>
                              </v-btn>
                              <v-btn @click="modifyUser(item.name)" icon>
                                <v-icon> mdi-pencil </v-icon>
                              </v-btn>
                            </v-container>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          dense
                          v-for="(key, index) in filteredKeys"
                          :key="index"
                        >
                          <v-list-item-content
                            :class="{ 'primary--text': sortBy === key }"
                          >
                            {{ key }} : {{ item[key.toLowerCase()] }}
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider />
                      </v-list>
                    </v-content>
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
import { User } from "@/model/User";
import CRUD_User from "@/components/CRUD_User.vue";

@Component({
  components: { Heading1, Header, CRUD_User },
})
export default class Admin extends Vue {
  private overlay = false;
  private crudUser = "";
  public createUser(): void {
    this.overlay = true;
    this.crudUser = "Create User";
  }
  public modifyUser(userName: string): void {
    this.overlay = true;
    this.crudUser = "Modify User: " + userName;
  }
  private usersLoading = true;
  private students = [
    { id: 1, name: "Jean Michel Antoine", userName: "JMA" },
    { id: 3, name: "Antoine Smith", userName: "AS" },
    { id: 4, name: "Nathalie Smart", userName: "NS" },
    { id: 5, name: "Baba Torino", userName: "BT" },
    { id: 6, name: "Lawrence Plank", userName: "LP" },
  ];
  private keys = ["id"];
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
  public getApi<T>(url: string): Promise<T> {
    return fetch(url).then((response) => {
      return response.json();
    });
  }
  public async getStudents(): Promise<void> {
    this.usersLoading = true;
    //todo
    /*
    this.students.push(
      ...(await this.getApi<User[]>())
    );
    */
    this.usersLoading = false;
  }
  public async mounted(): Promise<void> {
    await this.getStudents();
  }
}
</script>
