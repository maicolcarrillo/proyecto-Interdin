import { createRouter, createWebHistory } from "vue-router";
import ParametrizacionCreditosCr from "@/components/creditCostaRica/parametrizacionCreditosCr.vue";

const routes = [
  {
    path: "/costa-rica",
    name: "CostaRica",
    component: ParametrizacionCreditosCr,
  },
  // puedes agregar más rutas aquí
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
