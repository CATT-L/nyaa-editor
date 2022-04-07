import { createApp } from "vue";
import ElementPlus from "element-plus";
import * as ElementIcon from '@element-plus/icons-vue';
import ContextMenu from '@imengyu/vue3-context-menu';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import '@/vue3-context-menu.css';
import "element-plus/dist/index.css";
import 'flex.css'
import App from "./App.vue";

const app = createApp(App);


app.use(ElementPlus);
app.use(ContextMenu);

for (let iconName in ElementIcon) {
	app.component(iconName, ElementIcon[iconName])
}	

app.mount("#app");
