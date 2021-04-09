<template>
  <div>
    <v-container>
      <v-row class="d-lg-none">
        <v-col>
          <v-card>
            <v-card-title>
              Kylian Bourcoud
            </v-card-title>
            <v-card-subtitle>
              IT Engineer
            </v-card-subtitle>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  About Me
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu quam eget lorem scelerisque suscipit non varius tortor. In hac habitasse platea dictumst. In ullamcorper velit sed neque posuere, ac varius odio feugiat. Vestibulum et odio turpis. Nunc finibus euismod luctus. Sed tristique velit sit amet turpis elementum, vitae gravida purus ullamcorper. Nullam vulputate sed mi a imperdiet. Curabitur tincidunt, neque nec fringilla varius, lacus nunc sagittis leo, vitae condimentum lectus ipsum vitae ex.
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
          v-for="i in 12"
          :key="i"
        >
          <v-card
            class="mx-auto my-2"
            max-width="600px"
          >
            <v-row>
              <v-col
                class="py-0"
                sm="6"
                xs="12"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-img class="mx-auto " :src="'https://picsum.photos/id/'+i+'/500/200'"
                           v-bind="attrs"
                           v-on="on"
                           height="250px"
                    />
                    <!--v-skeleton-loader class="mx-auto" max-width="500" max-height="200" v-bind="attrs" type="image" /-->
                  </template>
                  <span>Bottom tooltip</span>
                </v-tooltip>
              </v-col>
              <v-col
                class="d-flex flex-column justify-lg-space-between"
                sm="6"
                xs="12"
              >
                <div>
                  <v-row>
                    <v-card-title>Projet {{i}}</v-card-title>
                    <v-spacer/>
                    <v-btn
                      class="mr-2 mt-2"
                      color="primary"
                      outlined
                      fab
                      small
                      elevation="2"
                    >
                      <v-icon>mdi-pencil-outline</v-icon>
                    </v-btn>
                    <v-btn
                      class="mr-5 mt-2"
                      color="primary"
                      outlined
                      fab
                      small
                      elevation="2"
                    >
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </v-row>
                  <v-card-text>
                     Aenean eu quam eget lorem scelerisque suscipit non varius tortor. In hac habitasse platea dictumst. In ullamcorper velit sed neque posuere, ac varius odio feugiat. Vestibulum et odio turpis.
                  </v-card-text>
                </div>
                <div class="mb-2">
                  <v-row class="d-flex flex-row justify-end">
                    <v-btn
                      class="mr-5"
                      outlined
                      elevation="2"
                      color="primary"
                    >
                      Learn More
                    </v-btn>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="my-4">
        <v-spacer/>
          <v-pagination
            v-model="page"
            length="6"
          >
          </v-pagination>
        <v-spacer/>
      </v-row>
    </v-container>
    <NavInfo :info="authorInfo"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Heading1 from "@/components/Heading1";
import NavInfo from "@/components/NavInfo.vue";

@Component({
  components: {
    NavInfo,
    Heading1,

  }
})
export default class Profil extends Vue {

  page = 1;

  private authorInfo = {
    title : "Kylian Bourcoud",
    subtitle : "IT Engineer",
    section : [
      {
        id : 1,
        title : "About me",
        content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus, purus sed luctus porta, libero arcu tincidunt dolor, nec ullamcorper turpis mi ut ipsum. Donec ac eros pulvinar, dapibus nisi vel, molestie ligula. "
      }
    ]
  }

}
</script>

<style scoped>

</style>