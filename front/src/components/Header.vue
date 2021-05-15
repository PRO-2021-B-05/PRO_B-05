<template>
  <div>
    <v-app-bar color="white" clipped-right app>
      <v-img
        max-height="50px"
        max-width="50px"
        src="https://picsum.photos/id/11/500/300"
      ></v-img>
      <v-app-bar-title class="ml-3">
        <div>StArt</div>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon
        class="d-lg-none"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <div class="d-none d-lg-block">
        <v-btn v-for="link in links" :key="link.id" :to="link.address" text>
          <v-icon>{{ link.icon }}</v-icon>
          {{ link.name }}
        </v-btn>
        <span v-if="connected">
          <v-btn :to="`/profil/${profileUuid}`" text>
            <v-icon>mdi-account-outline</v-icon>
            Profil
          </v-btn>
        </span>
        <span v-else>
          <v-btn @click="overlay = !overlay" text>
            <v-icon>mdi-login</v-icon>
            Log in
          </v-btn>
        </span>
      </div>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app temporary height="100%">
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item v-if="connected" :to="`/profil/${profileUuid}`">
            <v-list-item-title>
              <v-icon>mdi-account-outline</v-icon>
              Profil
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-else @click="(overlay = !overlay), (drawer = false)">
            <v-list-item-title>
              <v-icon>mdi-login</v-icon>
              Log in
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="link in links"
            :key="link.id"
            :to="link.address"
          >
            <v-list-item-title>
              <v-icon>{{ link.icon }}</v-icon>
              {{ link.name }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="connected" to="/" @click="disconnect">
            <v-list-item-title>
              <v-icon>mdi-logout</v-icon>
              Log out
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <Login
      :overlay="overlay"
      @close="overlay = false"
      @connected="connect"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Login from "@/components/Login.vue";
import { Student } from "@/model/IStudent";

@Component({
  components: { Login },
})
export default class Header extends Vue {
  private links = [
    {
      id: 1,
      name: "Discover",
      icon: "mdi-magnify",
      address: "/",
    },
    {
      id: 2,
      name: "Events",
      icon: "mdi-calendar",
      address: "/events",
    },
  ];
  private overlay = false;
  private drawer = false;
  private group = null;
  private connected = false;
  private profileUuid = "";
  public async mounted(): Promise<void> {
    this.connected = await this.$api.isConnected();
    if (this.connected) {
      this.profileUuid = (await this.$api.getMyProfile()).uuid;
    }
  }
  public async connect(): Promise<void> {
    this.connected = true;
    this.profileUuid = (await this.$api.getMyProfile()).uuid;
  }
  public disconnect(): void {
    this.$api.clearToken();
    this.connected = false;
  }
}
</script>

<style scoped></style>
