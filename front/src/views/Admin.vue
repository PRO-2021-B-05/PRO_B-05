<template>
  <div class="Admin">
    <v-container>
      <heading1> Admin </heading1>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import Heading1 from "@/components/Heading1.vue";

@Component({
  components: { Heading1, Header },
})
export default class Admin extends Vue {
}
</script>
