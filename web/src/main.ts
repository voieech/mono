import "./main.css";

import { VueQueryPlugin } from "@tanstack/vue-query";
import { createHead } from "@unhead/vue/client";
import { createApp } from "vue";

import App from "./App.vue";
import { i18n } from "./i18n";
import { router } from "./router";
import { queryClient } from "./vueQuery";

createApp(App)
  .use(createHead())
  .use(VueQueryPlugin, {
    queryClient,
    enableDevtoolsV6Plugin: true,
  })
  .use(router)
  .use(i18n)
  .mount("#app");
