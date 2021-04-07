<template>
  <div class="Discover">
    <v-container> <h1>Discover</h1> </v-container>
    <!-- futur header -->
    <!-- HelloWorld msg="Welcome to Your Vue.js + TypeScript App" / -->
    <v-container>
      <v-row>
        <v-col v-for="i in 12"
               :key="i"
               cols="12">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-img class="mx-auto" height="200" width="500" :src="'https://picsum.photos/id/'+i+'/500/200'"
                v-bind="attrs"
                v-on="on"
              />
              <!--v-skeleton-loader class="mx-auto" max-width="500" max-height="200" v-bind="attrs" type="image" /-->
            </template>
            <span>Bottom tooltip</span>
          </v-tooltip>

        </v-col>
      </v-row>

    </v-container>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>
