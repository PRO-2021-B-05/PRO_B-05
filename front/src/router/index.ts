import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Discover from "../views/Discover.vue";
import Profil from "../views/Profil.vue";
import Project from "@/views/Project.vue";
import Events from "@/views/Events.vue";
import CreateProject from "../views/CreateProject.vue";
import ModifyProject from "../views/ModifyProject.vue";
import Admin from "@/views/Admin.vue";
import ErrorPage from "@/views/ErrorPage.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Discover",
    component: Discover,
  },
  {
    path: "/profil/:uuid",
    name: "Profil",
    component: Profil,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/project/:uuid",
    name: "Project",
    component: Project,
  },
  {
    path: "/createProject",
    name: "CreateProject",
    component: CreateProject,
  },
  {
    path: "/modifyProject/:uuid",
    name: "ModifyProject",
    component: ModifyProject,
  },
  {
    path: "/events",
    name: "Events",
    component: Events,
  },
  {
    path: "/errorPage",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
