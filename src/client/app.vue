<template>
  <div id="app">
    <div v-if='checkAuth'>Checking Login Status ... </div>
    <Login v-if='!checkAuth && !auth.isLogin'/>
    <Talk v-if='!checkAuth && auth.isLogin'/>
  </div>
</template>

<script lang='babel'>
// import Welcome from './components/welcome.vue'
import Talk from './components/talk.vue'
import GlobalStore from './global-store'
import Login from './components/login.vue'
import ls from 'local-storage'

export default {
  components: { Talk, Login },
  data () {
    return {
      name: 'Initial value.',
      auth: GlobalStore.auth,
      checkAuth: false
    }
  },

  created () {
    const token = ls('token')
    if (!token) return
    this.auth.setToken(token)
    this.checkAuth = true
    fetch('/api/login-status', {
      headers: {
        'Authorization': `Bearer ${this.auth.token}`
      }
    }).then((res) => {
      this.checkAuth = false
      if (res.ok) {
        this.auth.login()
      } else if (res.status === 401) {
        this.auth.logout()
      }
    }).catch(err => {
      console.error('login error: ', err)
      this.checkAuth = false
      this.auth.logout()
    })
  },
  methods: {
  }
}
</script>

<style>
#app {
  height: calc(100vh - 16px);
}
* {
  text-transform: none !important;
}
</style>
