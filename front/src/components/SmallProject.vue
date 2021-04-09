<template>
  <v-card href="/project" elevation="2" v-if="picture">
    <v-img position="center center" height="250" :src="picture.download_url" />
    <v-container class="px-1 py-4">
      <v-row>
        <v-btn href="/project" small text color="primary" class="mx-1">
          see full project
        </v-btn>
      </v-row>
      <v-row v-if="author">
        <v-btn href="/profil" x-small text class="mx-2 mb-1">
          by {{ picture.author }}
        </v-btn>
      </v-row>
      <v-row v-if="description">
        <v-btn href="/profil" x-small text class="mx-2 mb-1">
          {{ picture.download_url }}
        </v-btn>
      </v-row>
    </v-container>
  </v-card>
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
  @Prop() private readonly picture?: Picture;
  private author = true;
  private description = true;
}
</script>
