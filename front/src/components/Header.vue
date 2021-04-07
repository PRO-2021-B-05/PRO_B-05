<template>
  <div>
    <v-app-bar color="white">
      <div>
        <v-img
          max-height="50px"
          max-width="50px"
          src="https://picsum.photos/id/11/500/300"
        ></v-img>
      </div>
      <v-app-bar-title>StArt</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon class="d-lg-none" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-none d-lg-block">
        <v-btn
          v-for="link in links" :key="link.id"
          :href="link.address"
          text
        >
          <v-icon>{{link.icon}}</v-icon>
          {{ link.name }}
        </v-btn>
        <span v-if="connected">
          <v-btn
            href="/Profil"
            text
          >
            <v-icon>mdi-account-outline</v-icon>
            Profil
          </v-btn>
        </span>
        <span v-else>
          <v-btn
            @click = "overlay = !overlay"
            text
          >
            <v-icon>mdi-login</v-icon>
            Login
          </v-btn>
        </span>

      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item
            v-if="connected"
            href="/profil"
          >
            <v-list-item-title>
              <v-icon>mdi-account-outline</v-icon>
              Profil
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-else
            @click="overlay = ! overlay, drawer = false"
          >
            <v-list-item-title>
              <v-icon>mdi-login</v-icon>
              Login
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="link in links" :key="link.id"
            :href="link.address"
          >
            <v-list-item-title>
              <v-icon>{{link.icon}}</v-icon>
              {{ link.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-overlay
      :value = "overlay"
      :absolute = "absolute"
    >
      <v-card color="white" light>
        <v-form>
          <v-container>
            <v-col>
              <v-text-field
                label="Username"
              >

              </v-text-field>
              <v-text-field
                label="Password"
                type = "password"
              >

              </v-text-field>
              <v-row>
                <v-btn color="purple lighten-3">Login</v-btn>
                <v-spacer/>
                <v-btn
                  @click="overlay = false"
                >
                  cancel
                </v-btn>
              </v-row>
            </v-col>
          </v-container>
        </v-form>
      </v-card>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Header extends Vue{
  links = [
    {
      id : 1,
      name : "Discover",
      icon: "mdi-magnify",
      address : "/"
    },
    {
      id : 2,
      name : "Events",
      icon: "mdi-calendar",
      address : "/events"
    }
  ];
  overlay = false;
  absolute = true;
  drawer = false;
  group = null;
  connected = true;
};
</script>

<style scoped>

</style>