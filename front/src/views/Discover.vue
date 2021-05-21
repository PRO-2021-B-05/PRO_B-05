<template>
  <div class="Discover">
    <v-container>
      <heading1> Discover </heading1>
      <v-row>
        <v-col
          class="px-1 py-1"
          xs="12"
          sm="6"
          lg="4"
          xl="3"
          v-for="id in projects.length"
          :key="id"
        >
          <div v-if="id > projects.length && projectsLoading">
            <v-skeleton-loader
              elevation="2"
              class="mx-auto"
              type="card"
              :width="400"
            />
          </div>
          <SmallProject
            :authorDisplay="true"
            :descriptionDisplay="false"
            v-else
            :project="projects[id - 1]"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-divider class="my-6" />
      </v-row>
      <v-row> </v-row>
    </v-container>
    <div class="text-center mb-6" v-if="numberOfPages > 1">
      <v-pagination
        @input="getProjects"
        v-model="page"
        :length="numberOfPages"
        :total-visible="pageLimit"
      ></v-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import SmallProject from "@/components/SmallProject.vue";
import Heading1 from "@/components/Heading1.vue";
import { IProject } from "@/model/IProject";

@Component({
  components: { Heading1, SmallProject, Header },
})
export default class Discover extends Vue {
  private nProjects = 24;
  private pageLimit = 7;
  private numberOfPages = 0;
  private page = 1;
  private projects: IProject[] = [];
  private projectsLoading = true;
  // méthodes
  public async getProjects(): Promise<void> {
    this.projectsLoading = true;
    let pagination = await this.$api.getProjects(
      this.nProjects * (this.page - 1),
      this.nProjects
    );
    this.numberOfPages = pagination.total;
    this.projects = pagination.results;
    this.projectsLoading = false;
  }
  public async mounted(): Promise<void> {
    await this.getProjects();
  }
}
</script>
