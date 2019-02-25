import Vue from "vue";
import App from "./app.vue";
import Vuetify, { VApp, VDialog, VCard, VContainer, VForm, VLayout, VFlex, VTextField, VTextarea, VBtn, VSpacer, VList, VIcon, VToolbar, VAlert } from "vuetify/lib";
import "vuetify/src/stylus/app.styl";
import "material-design-icons-iconfont/dist/material-design-icons.css";
Vue.use(Vuetify, {
  components: { VApp, VDialog, VCard, VContainer, VForm, VLayout, VFlex, VTextField, VTextarea, VBtn, VSpacer, VList, VIcon, VToolbar, VAlert }
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App)
}).$mount("#app");
