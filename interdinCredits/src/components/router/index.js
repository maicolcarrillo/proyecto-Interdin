import {
  createRouter,
  createWebHistory
} from "vue-router";
import ParametrizacionCreditos from "@/components/ParametrizacionCreditos.vue";
import ParametrizacionCreditosCr from "@/components/creditCostaRica/parametrizacionCreditosCr.vue";
import ParametrizacionCreditosPa from "@/components/creditPanama/parametrizacionCreditosPa.vue";

const routes = [{
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
    path: "/panama",
    component: ParametrizacionCreditosPa,
    name: "panama",
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;