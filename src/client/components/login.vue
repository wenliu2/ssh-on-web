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
              <v-alert :value='errorMsg !== ""' color='error' icon='warning' outline>Username/Password mismatch.</v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
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
import ls from 'local-storage'

export default {
  data () {
    return {
      nt: '',
      password: '',
      auth: GlobalStore.auth,
      errorMsg: ''
    }
  },

  methods: {
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
