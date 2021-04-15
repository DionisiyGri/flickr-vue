import Vue from "vue";
import App from "./App.vue";
import AsyncComputed from "vue-async-computed";

Vue.config.productionTip = false;
Vue.use(AsyncComputed);

Vue.prototype.$apiUrl = "http://localhost:8000/api/";
Vue.prototype.$flickrAPI =
  "http://api.flickr.com/services/feeds/photos_public.gne?format=json&lang=en-us&nojsoncallback=true";

new Vue({
  render: (h) => h(App),
}).$mount("#app");
