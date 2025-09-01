import { createRouter, createWebHistory } from "vue-router";
import ParametrizacionCreditos from "@/components/ParametrizacionCreditos.vue";
import ParametrizacionCreditosCr from "@/components/creditCostaRica/parametrizacionCreditosCr.vue";
import ParametrizacionCreditosHn from "@/components/creditHonduras/parametrizacionCreditosHn.vue";

const routes = [
  {
    path: "/",
    component: ParametrizacionCreditos,
    name: "ecuador",
  },
  {
    path: "/costa-rica",
    component: ParametrizacionCreditosCr,
    name: "costa-rica",
  },
  {
    path: "/honduras",
    component: ParametrizacionCreditosHn,
    name: "honduras",
  },
  ,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
