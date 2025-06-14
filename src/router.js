import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/authors",
      name: "authors",
      component: () => import("./views/AuthorPage.vue"),
    },
    {
      path: "/books",
      name: "books",
      component: () => import("./views/BookPage.vue"),
    },
    {
      path: "/userbooks",
      name: "userBooks",
      component: () => import("./views/UserBookPage.vue"),
    },
    {
      path: "/tags",
      name: "tags",
      component: () => import("./views/TagPage.vue"),
    },
  ],
});

export default router;
