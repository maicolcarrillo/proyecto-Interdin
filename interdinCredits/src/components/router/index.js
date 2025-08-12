import {
  createRouter,
  createWebHistory
} from "vue-router";
import ParametrizacionCreditos from "@/components/ParametrizacionCreditos.vue";
import ParametrizacionCreditosCr from "@/components/creditCostaRica/parametrizacionCreditosCr.vue";

const routes = [{
    path: "/",
    component: ParametrizacionCreditos,
    name: "ecuador"
  },
  {
    path: "/costa-rica",
    component: ParametrizacionCreditosCr,
    name: "costa-rica"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;