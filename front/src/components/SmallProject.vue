<template>
  <v-card href="/project" elevation="hover? 12 2" v-if="picture" hover="hover">
    <v-img height="250" :src="picture.download_url" />
    <v-container class="px-1 py-4">
        <v-card-title href="/project"   class="py-0 text--primary">
          Project name
        </v-card-title>
      <v-btn href="/profil" small text class="px-4" v-if="author">
        by {{ picture.author }}
      </v-btn>
      <div v-if="description">
        <v-divider class="my-4"/>
        <v-card-subtitle class="py-0 px-4">
          Heading
        </v-card-subtitle>
        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec risus nulla, mollis ut eleifend sed, tincidunt at velit. Ut vitae convallis metus, non condimentum turpis. Donec ut erat ut enim sollicitudin vestibulum. Aenean vel sem massa.
        </v-card-text>
      </div>
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
  @Prop() private readonly project?: Picture;
  @Prop() private readonly picture?: Picture;
  @Prop({default: false}) private author!: boolean;
  @Prop({default: false}) private description!: boolean;
}
</script>
