<template>
  <div id="app">
    <h1>Simple Vue Full Stack Example! </h1>
    <Welcome :name='name'/>
    <button v-on:click='fetchUser'>fetch user</button>
  </div>
</template>

<script lang='babel'>
import Welcome from './components/welcome.vue'

export default {
  components: { Welcome },
  data () {
    return {
      name: 'Initial value.'
    }
  },

  mounted () {
  },
  methods: {
    fetchUser () {
      fetch('/api/getUsername')
        .then(res => res.json())
        .then(user => { this.name = user.username })
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  font-size: 0.8em;
}
</style>
