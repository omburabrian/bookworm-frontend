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
      path:"/reviews",
      name: "reviews",
      component: () => import("./views/ReviewList.vue"),
    },
    {
      path:"/reviews/users/:userId/books/:bookId",
      name: "editReview",
      component: () => import("./views/EditReview.vue"),
    },
    {
      path: "/books",
      name: "books",
      component: () => import("./views/BookView.vue"),
    },
    {
      path: "/books/edit",
      name: "bookEdit",
      component: () => import("./views/BookEdit.vue"),
    },
    {
      path: "/tags",
      name: "tags",
      component: () => import("./views/TagPage.vue"),
    },
  ],
});

export default router;
