import { createRouter, createWebHashHistory } from "vue-router";
import TextPane from "../views/TextPane.vue";

const routes = [
  {
    path: "/",
    name: "TextPane",
    component: TextPane
  },
  // {
    // path: "/text",
    // name: "TextPane",
    // // route level code-splitting
    // // this generates a separate chunk (about.[hash].js) for this route
    // // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "Text" */ "../views/TextPane.vue")
  // },
  // {
    // path: "/github/:username?/:repository?/:branch?/:filename?",
    // name: "LoadFromGithub",
    // // route level code-splitting
    // // this generates a separate chunk (about.[hash].js) for this route
    // // which is lazy-loaded when the route is visited.
    // component: () =>
      // import(/* webpackChunkName: "Text" */ "../views/LoadFromGithub.vue")
  // }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
