<template>
  <div>
    <v-container>
      <v-row class="d-lg-none">
        <v-col>
          <v-card v-if="authorInfo">
            <v-card-title>
              {{ authorInfo.title }}
            </v-card-title>
            <v-card-subtitle>
              {{ authorInfo.subtitle }}
            </v-card-subtitle>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Description
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{ authorInfo.section[0].content }}
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
    <NavInfo v-if="authorInfo" :info="authorInfo" />
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
  private pageLimit = 12;
  private nbLoaded = this.pageLimit;
  private pageLoaded = 1;
  private projects: SimpleProject[] = [];
  private projectsLoading = true;
  public async getStudent(uuid: string): Promise<void> {
    const student: Student = await this.$api.getStudent(uuid);
    this.authorInfo = {
      title: `${student.firstname} ${student.lastname}`,
      subtitle: null,
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
