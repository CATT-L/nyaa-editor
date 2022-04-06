import { createApp } from "vue";
import ElementPlus from "element-plus";
import ContextMenu from '@imengyu/vue3-context-menu';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import '@/vue3-context-menu.css';
import "element-plus/dist/index.css";
import App from "./App.vue";

const app = createApp(App);

app.use(ElementPlus);
app.use(ContextMenu);
app.mount("#app");
