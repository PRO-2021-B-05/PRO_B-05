<template>
  <div>
    <v-container>
      <v-row class="d-lg-none">
        <v-col>
          <v-card>
            <v-card-title> Kylian Bourcoud </v-card-title>
            <v-card-subtitle> IT Engineer </v-card-subtitle>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header> About Me </v-expansion-panel-header>
                <v-expansion-panel-content>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aenean eu quam eget lorem scelerisque suscipit non varius
                  tortor. In hac habitasse platea dictumst. In ullamcorper velit
                  sed neque posuere, ac varius odio feugiat. Vestibulum et odio
                  turpis. Nunc finibus euismod luctus. Sed tristique velit sit
                  amet turpis elementum, vitae gravida purus ullamcorper. Nullam
                  vulputate sed mi a imperdiet. Curabitur tincidunt, neque nec
                  fringilla varius, lacus nunc sagittis leo, vitae condimentum
                  lectus ipsum vitae ex.
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
      </v-row>
      <Heading1>Projects</Heading1>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn
          class="my-3 mx-3"
          color="primary"
          dark
          outlined
          elevation="2"
          href="/createProject"
        >
          <v-icon>mdi-plus</v-icon>
          Add Project
        </v-btn>
      </v-row>
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
            description="true"
            v-else
            titre="hello"
            :id="id"
            :picture="projects[id]"
          />
        </v-col>
      </v-row>
    </v-container>
    <NavInfo :info="authorInfo" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Heading1 from "@/components/Heading1.vue";
import NavInfo from "@/components/NavInfo.vue";
import SmallProject from "@/components/SmallProject.vue";
import { Picture } from "@/model/Picture";

@Component({
  components: {
    SmallProject,
    NavInfo,
    Heading1,
  },
})
export default class Profil extends Vue {
  page = 1;

  private pageLimit = 12;
  private nbLoaded = this.pageLimit;
  private pageLoaded = 1;
  private projects: Picture[] = [];
  private projectsLoading = true;

  scroll() {
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
  }
  public async mounted() {
    this.scroll();
    await this.getProjects();
  }

  private authorInfo = {
    title: "Kylian Bourcoud",
    subtitle: "IT Engineer",
    section: [
      {
        id: 1,
        title: "About me",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus, purus sed luctus porta, libero arcu tincidunt dolor, nec ullamcorper turpis mi ut ipsum. Donec ac eros pulvinar, dapibus nisi vel, molestie ligula. ",
      },
    ],
  };
}
</script>

<style scoped></style>
