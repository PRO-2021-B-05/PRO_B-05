<template>
  <v-app>
    <Header/>
    <v-main>
      <RouterView/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Header from "@/components/Header.vue";
import Discover from "@/views/Discover.vue";
@Component({
  components: {
    Discover,
    Header
  },
})
export default class App extends Vue {

}
</script>
