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
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import SmallProject from "@/components/SmallProject.vue";
import { Picture } from "@/model/Picture.ts";
import Heading1 from "@/components/Heading1.vue";
import { SimpleProject } from "@/model/SimpleProject";

@Component({
  components: { Heading1, SmallProject, Header },
})
export default class Discover extends Vue {
  private pageLimit = 12;
  private nbLoaded = this.pageLimit;
  private pageLoaded = 1;
  private projects: SimpleProject[] = [];
  private projectsLoading = true;
  scroll(): void {
    window.onscroll = () => {
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight
      ) {
        if (this.nbLoaded < 200) {
          this.nbLoaded += this.pageLimit;
          this.pageLoaded += 1;
          this.getProjects();
        }
      }
    };
  }
  /*
  public getApi<T>(url: string): Promise<T> {
    return fetch(url).then((response) => {
      return response.json();
    });
  }
 
  public async getProjects() {
    this.projectsLoading = true;
    this.projects.push(
      ...(await this.getApi<Picture[]>(
        `https://picsum.photos/v2/list?page=${this.pageLoaded}&limit=${
          1 + this.pageLimit
        }`
      ))
    );
    this.projectsLoading = false;
  }*/
  public async getProjects(): Promise<void> {
    this.projectsLoading = true;
    this.projects = await this.$api.getProjects();
    this.projectsLoading = false;
  }
  public async mounted(): Promise<void> {
    //this.scroll();
    await this.getProjects()
  }
}
</script>
