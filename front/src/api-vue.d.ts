import { Communication } from "@/APIs/Communication";

declare module "vue/types/vue" {
  //fichier utile pour l'auto-complétion pour le compilateur
  interface Vue {
    //static publique
    $api: Communication;
  }
}
