<template>
  <div>

    <NavInfo :info="ProjectInfo" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Header from "@/components/Header.vue";
import Discover from "@/views/Discover.vue";
import NavInfo from "@/components/NavInfo.vue";
@Component({
  components: {
    NavInfo

  }
})
export default class Project extends Vue {
  private ProjectInfo = {
    title : "Project Name",
    section : [
      {
        id : 1,
        title : "Description",
        content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus, purus sed luctus porta, libero arcu tincidunt dolor, nec ullamcorper turpis mi ut ipsum. Donec ac eros pulvinar, dapibus nisi vel, molestie ligula. "
      }
    ]
  }
}
</script>

<style scoped>

</style>