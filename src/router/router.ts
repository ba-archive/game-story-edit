import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () => import("@components/LoginScreen.vue"),
  },
  {
    path: "/overview",
    name: "EditorHome",
    meta: {
      title: "剧情编辑工具",
    },
    component: () => import("@components/StoryListContainer.vue"),
  },
  {
    path: "/edit/:uuid",
    name: "EditorMain",
    meta: {
      title: "编辑剧情",
    },
    component: () => import("@components/EditorMain.vue"),
  },
  {
    path: "/",
    redirect: "/login",
  },
];

const routerConvert = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { routerConvert, routes };
