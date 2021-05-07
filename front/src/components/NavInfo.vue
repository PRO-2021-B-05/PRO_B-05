<template>
  <v-navigation-drawer app right clipped>
    <v-card-title class="mb-0">
      {{ info.title }}
    </v-card-title>
    <v-col cols="12" v-for="sect in info.section" :key="sect.id">
      <v-divider class="mx-4 my-4"></v-divider>
      <v-row class="mx-4 my-2">
        <div class="subtitle-1">{{ sect.title }}</div>
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined fab small elevation="2" v-if="modify">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </v-row>
      <v-card-text class="pt-1">
        {{ sect.content }}
      </v-card-text>
    </v-col>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class NavInfo extends Vue {
  @Prop({ default: false }) private info!: NavInfo;
  @Prop({ default: false }) private modify!: boolean;
}
</script>

<style scoped></style>
