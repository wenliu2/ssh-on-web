<template>
<v-app id='login'>
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
                <v-text-field prepend-icon="person" name="nt" label="Login" type="text" v-model='nt' autofocus></v-text-field>
                <v-text-field prepend-icon="lock" name="password" label="Password" type="password" v-model='password'></v-text-field>
              </v-form>
              <v-alert :value='errorMsg !== ""' color='error' icon='warning' outline>{{ this.errorMsg }}</v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="signUpModal"
                width="500">
                <v-btn
                  slot="activator"
                >Sign up</v-btn>
                <v-card>
                  <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                  >Sign Up
                  </v-card-title>
                  <v-card-text>
                    <v-text-field
                      label="Username"
                      v-model="nt"
                    ></v-text-field>
                     <v-text-field
                      v-model="password"
                      :append-icon="vPwd ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.password]"
                      :type="vPwd ? 'text' : 'password'"
                      name="input-10-1"
                      label="Password"
                      counter
                      @click:append="vPwd = !vPwd"
                    ></v-text-field>
                     <v-text-field
                      v-model="verifiedPassword"
                      :append-icon="vVPwd ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.verifiedPassword]"
                      :type="vVPwd ? 'text' : 'password'"
                      name="input-10-1"
                      label="Verfied Password"
                      counter
                      @click:append="vVPwd = !vVPwd"
                    ></v-text-field>
                  </v-card-text>
                  <v-alert :value='errorMsg !== ""' color='error' icon='warning' outline>{{ this.errorMsg }}</v-alert>
                  <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    flat
                    @click="signUpModal = false"
                  >Cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    flat
                    @click="signUp"
                  >Sign Up
                  </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn color="primary" v-on:click='login'>Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</v-app>
</template>
<script lang='babel'>
import GlobalStore from '../global-store'
import UTILS from '../utils/utils'
import ls from 'local-storage'

export default {
  data () {
    return {
      nt: '',
      password: '',
      verifiedPassword: '',
      auth: GlobalStore.auth,
      errorMsg: '',
      vPwd: false,
      vVPwd: false,
      rules: UTILS.rules,
      signUpModal: false
    }
  },

  watch: {
    signUpModal: function (val) {
      this.errorMsg = ''
      this.nt = ''
      this.password = ''
      this.verifiedPassword = ''
    },

    errorMsg: function (val) {
      if (val !== '') {
        setTimeout(() => {
          this.errorMsg = ''
        }, 1000)
      }
    }
  },

  methods: {
    signUp () {
      this.errorMsg = ''
      fetch('/auth/signup', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          nt: this.nt,
          password: this.password,
          verifiedPassword: this.verifiedPassword
        })
      }).then((res) => {
        if (res.ok) {
          this.login()
          this.signUpModal = false
        } else {
          this.nt = ''
          this.password = ''
          this.verifiedPassword = ''
          this.errorMsg = 'Sign Up Failed'
        }
      }).catch((err) => {
        console.log('err', err)
        this.nt = ''
        this.password = ''
        this.verifiedPassword = ''
        this.errorMsg = 'Sign Up Failed'
      })
    },

    login () {
      this.errorMsg = ''
      fetch('/auth/login', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ nt: this.nt, password: this.password })
      }).then((res) => {
        if (res.ok) {
          res.json().then((json) => {
            this.auth.setToken(json.token)
            ls('token', json.token)
            this.auth.login()
          })
        } else {
          this.errorMsg = 'Username/Password mismatch.'
          this.auth.logout()
        }
      }).catch((err) => {
        console.log('err', err)
        this.errorMsg = 'Login failed.'
        this.auth.logout()
      })
    }
  }
}
</script>
