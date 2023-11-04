import { createApp } from "vue";
import "./style.scss";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { routerConvert } from "./router/router";
import { Message } from "@arco-design/web-vue";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
Message._context = app._context;
app.use(pinia).use(routerConvert).mount("#app");
