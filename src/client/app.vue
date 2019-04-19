<template>
  <div id="app">
    <div v-if="checkAuth">Checking Login Status ...</div>
    <Login v-if="!checkAuth && !auth.isLogin"/>
    <Talk v-if="!checkAuth && auth.isLogin"/>
    <v-snackbar v-model="auth.tokenExpired" top :timeout="5000" color="error">
      Token is Expired, please Login again.
      <v-btn color="white" flat @click="auth.tokenExpired = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
// import Welcome from './components/welcome.vue'
import Talk from "./components/talk.vue";
import GlobalStore from "./global-store";
import Login from "./components/login.vue";
import ls from "local-storage";

export default {
  components: { Talk, Login },
  data() {
    return {
      name: "Initial value.",
      auth: GlobalStore.auth,
      checkAuth: false
    };
  },

  mounted() {
    const token = ls("token");
    if (!token) return;
    this.auth.setToken(token);
    this.checkAuth = true;
    fetch("/api/login-status", {
      headers: {
        Authorization: `Bearer ${this.auth.token}`
      }
    })
      .then(res => {
        this.checkAuth = false;
        if (res.ok) {
          // this.auth.login();
          return res.json();
        } else if (res.status === 401) {
          this.auth.logout();
        }
      })
      .then(res => {
        this.auth.login(res.user.nt);
      })
      .catch(err => {
        console.error("login error: ", err);
        this.checkAuth = false;
        this.auth.logout();
      });
  },
  methods: {}
};
</script>

<style lang="scss">
#app {
  // height: calc(100vh - 16px);
  background-color: black;
}
* {
  text-transform: none !important;
}
</style>
