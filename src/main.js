// import "@/assets/style.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'jquery/dist/jquery.min.js'

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js";

createApp(App).use(router).mount("#app");
