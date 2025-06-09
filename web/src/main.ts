import "./main.css";

import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { queryClient } from "./vueQuery";
import App from "./App.vue";
import { router } from "./router";
import { i18n } from "./i18n";

createApp(App)
  .use(VueQueryPlugin, {
    queryClient,
    enableDevtoolsV6Plugin: true,
  })
  .use(router)
  .use(i18n)
  .mount("#app");
