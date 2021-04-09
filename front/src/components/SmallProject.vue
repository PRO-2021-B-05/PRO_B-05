<template>
  <v-container>
    <v-card class="mx-auto" :width="cWidth" elevation="2" v-if="project">
      <div>
        <v-img :height="cHeight" :width="cWidth" :src="project.download_url" />
        <v-card-title>{{ project.author }}</v-card-title>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Picture } from "@/model/Picture.ts";

@Component({
  components: {},
})
export default class SmallProject extends Vue {
  @Prop({ default: true }) private readonly loading: boolean | undefined;
  @Prop({ default: 200 }) private readonly cHeight: number | undefined;
  @Prop({ default: 400 }) private readonly cWidth: number | undefined;
  @Prop({ default: "" }) private readonly titre: string | undefined;
  @Prop({ default: true }) private readonly id: number | undefined;
  @Prop() private readonly project?: Picture;
}
</script>
