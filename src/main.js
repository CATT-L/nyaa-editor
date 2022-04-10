import { createApp } from "vue";
import store from "@/store";
import ElementPlus from "element-plus";
import * as ElementIcon from "@element-plus/icons-vue";
import ContextMenu from "@imengyu/vue3-context-menu";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import "@/vue3-context-menu.css";
import "element-plus/dist/index.css";
import "flex.css";
import App from "./App.vue";

const app = createApp(App);

app.use(store);
app.use(ElementPlus);
app.use(ContextMenu);

for (let iconName in ElementIcon) {
  app.component(`ElIcon${iconName}`, ElementIcon[iconName]);
}

app.mount("#app");

window.$vm = {
  $app: app,
  $store: app.config.globalProperties.$store,
};
