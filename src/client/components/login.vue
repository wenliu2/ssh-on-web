<template>
  <v-app id="login">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="nt"
                    label="Login"
                    type="text"
                    v-model="nt"
                    @keyup.enter="login"
                    autofocus
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                    @keyup.enter="login"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-dialog v-model="signUpModal" width="500">
                  <v-btn class="login-menu-action-button" slot="activator">Sign up</v-btn>
                  <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>Sign Up</v-card-title>
                    <v-card-text>
                      <v-text-field
                        prepend-icon="person"
                        label="Username"
                        v-model="nt"
                        @keyup.enter="signUp"
                      />
                      <v-text-field
                        v-model="password"
                        prepend-icon="lock"
                        :append-icon="vPwd ? 'visibility_off' : 'visibility'"
                        :rules="[rules.required, rules.password]"
                        :type="vPwd ? 'text' : 'password'"
                        name="input-10-1"
                        label="Password"
                        counter
                        @keyup.enter="signUp"
                        @click:append="vPwd = !vPwd"
                      />
                      <v-text-field
                        v-model="verifiedPassword"
                        prepend-icon="lock"
                        :append-icon="vVPwd ? 'visibility_off' : 'visibility'"
                        :rules="[rules.required, rules.verifiedPassword]"
                        :type="vVPwd ? 'text' : 'password'"
                        name="input-10-1"
                        label="Verfied Password"
                        counter
                        @click:append="vVPwd = !vVPwd"
                        @keyup.enter="signUp"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" flat @click="signUpModal = false">Cancel</v-btn>
                      <v-btn color="primary" flat @click="signUp">Sign Up</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-btn class="login-menu-action-button" color="primary" v-on:click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-dialog v-model="errorMsgOpen" max-width="290">
            <v-card>
              <v-card-title class="headline">Error</v-card-title>
              <v-card-text>{{ this.errorMsg }}</v-card-text>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import GlobalStore from "../global-store";
import UTILS from "../utils/utils";
import ls from "local-storage";

export default {
  data() {
    return {
      nt: "",
      password: "",
      verifiedPassword: "",
      auth: GlobalStore.auth,
      errorMsg: "",
      vPwd: false,
      vVPwd: false,
      rules: UTILS.rules,
      signUpModal: false,
      errorMsgOpen: false
    };
  },

  watch: {
    signUpModal: function(val) {
      this.errorMsg = "";
      this.nt = "";
      this.password = "";
      this.verifiedPassword = "";
    },

    errorMsg: function(val) {
      if (val !== "") {
        this.errorMsgOpen = true;
        setTimeout(() => {
          this.errorMsg = "";
          this.errorMsgOpen = false;
        }, 1000);
      }
    }
  },

  methods: {
    signUp() {
      this.errorMsg = "";
      fetch("/auth/signup", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          nt: this.nt,
          password: this.password,
          verifiedPassword: this.verifiedPassword
        })
      })
        .then(res => {
          if (res.ok) {
            this.login();
            this.signUpModal = false;
            return { error: "" };
          } else {
            this.nt = "";
            this.password = "";
            this.verifiedPassword = "";
            return res.json();
          }
        })
        .then(data => {
          this.errorMsg = data.error;
        })
        .catch(err => {
          console.log("err", err);
          this.nt = "";
          this.password = "";
          this.verifiedPassword = "";
          this.errorMsg = err;
        });
    },

    login() {
      this.errorMsg = "";
      fetch("/auth/login", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ nt: this.nt, password: this.password })
      })
        .then(res => {
          if (res.ok) {
            res.json().then(json => {
              this.auth.setToken(json.token);
              ls("token", json.token);
              ls("token-expired", Date.now());
              this.auth.login(json.user.nt);
            });
            return { message: "" };
          } else {
            this.auth.logout();
            return res.json();
          }
        })
        .then(err => {
          this.errorMsg = err.message;
        })
        .catch(err => {
          console.log("err", err);
          this.errorMsg = "Login failed.";
          this.auth.logout();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-menu-action-button {
  margin: 0 4px !important;
}
</style>
