import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { routerConvert } from './router/router';


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).use(pinia).use(routerConvert).mount('#app')
