import { createRouter, createWebHashHistory } from "vue-router";
import IDE from "../views/IDE.vue";

const routes = [
  {
    path: "/",
    name: "IDE",
    component: IDE
  },
  {
    path: "/text",
    name: "Text",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/Text.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
