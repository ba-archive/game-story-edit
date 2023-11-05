import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    meta: {
      title: "剧情编辑工具",
    },
    children: [
      {
        path: "/edit/:uuid",
        name: "EditorMain",
        meta: {
          title: "编辑剧情",
        },
        component: () => import("@components/EditorMain.vue"),
      },
    ],
  },
];

const routerConvert = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { routerConvert, routes };
