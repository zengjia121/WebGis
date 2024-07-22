/** @format */

import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.directive("draggable", {
  beforeMount(el) {
    el.style.cursor = "move";
    el.onmousedown = function (e) {
      let disX = e.clientX - el.offsetLeft;
      let disY = e.clientY - el.offsetTop;
      document.onmousemove = function (e) {
        let x = e.clientX - disX;
        let y = e.clientY - disY;
        el.style.left = x + "px";
        el.style.top = y + "px";
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
    };
  },
});

app.use(createPinia());
app.use(ElementPlus);
app.use(router);
app.mount("#app");
