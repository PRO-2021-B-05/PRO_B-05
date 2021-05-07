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
      <v-row v-if="modify">
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
            :authorDisplay="false"
            :descriptionDisplay="true"
            v-else
            :project="projects[id - 1]"
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
import { Student } from "@/model/IStudent";
import { INavInfo } from "@/model/INavInfo";
import { SimpleProject } from "@/model/SimpleProject";

@Component({
  components: {
    SmallProject,
    NavInfo,
    Heading1,
  },
})
export default class Profil extends Vue {
  private modify = false;
  private uuid?: string;

  page = 1;

  private pageLimit = 12;
  private nbLoaded = this.pageLimit;
  private pageLoaded = 1;
  private projects: SimpleProject[] = [];
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
  */
  public async getStudent(uuid: string): Promise<void> {
    const student: Student = await this.$api.getStudent(uuid);
    this.authorInfo = {
      title: `${student.firstname} ${student.lastname}`,
      subtitle: "IT Engineer",
      section: [
        {
          id: 1,
          title: "description",
          content: student.description,
        },
      ],
    };
  }

  public async getProjects(): Promise<void> {
    this.projectsLoading = true;
    this.projects = await this.$api.getStudentProjects(this.uuid);
    this.projectsLoading = false;
  }

  public async mounted(): Promise<void> {
    //this.scroll();
    this.uuid = this.$route.params.uuid;
    await this.getProjects();
    await this.getStudent(this.uuid);
  }

  private authorInfo: INavInfo | null = null;
}
</script>

<style scoped></style>
