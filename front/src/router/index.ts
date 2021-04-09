import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Discover from "../views/Discover.vue";
import Profil from "../views/Profil.vue";
import CreateProject from "../views/CreateProject.vue"
import Admin from "@/views/Admin.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Discover",
    component: Discover,
  },
  {
    path: "/profil",
    name: "Profil",
    component: Profil,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
