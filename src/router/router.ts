import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import("../App.vue"),
  },
];

const routerConvert = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { routerConvert, routes };
