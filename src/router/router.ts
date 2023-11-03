import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/edit',
    children: [
      {
        path: '/edit',
        name: 'EditorMain',
        meta: {
          title: "编辑剧情"
        },
        component: () => import("@components/EditorMain.vue"),
      },
    ]
  },

];

const routerConvert = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { routerConvert, routes };
