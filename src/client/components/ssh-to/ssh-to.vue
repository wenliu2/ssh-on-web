<template>
  <v-dialog v-model='dialog' fullscreen hide-overlay transition='dialog-bottom-transition'>
    <v-btn slot='activator' dark class='body-2' flat round small> SSH to </v-btn>
    <v-card>
      <v-toolbar dark dense>
        <v-btn small icon dark class='body-2' @click.native="dialog = false">
          <v-icon small>close</v-icon>
        </v-btn>
        <v-toolbar-title class='body-2'>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
          <v-btn small round dark flat @click.native="dialog = false" class='body-2'>Save</v-btn>
      </v-toolbar>
      <v-form ref='urlForm' v-model='valid' lazy-validation>
        <v-container fluid>
          <v-layout row wrap align-center>
            <v-flex xs12 sm6 md6>
              <v-text-field label='SSH To' :counter='100' v-model='url' required placeholder="user@hostname"
              :rules='[rules.required, rules.counter(100), rules.sshurl]'/>
            </v-flex>
            <v-flex xs12 sm6 md6 align-center>
              <v-btn small dark round v-on:click='saveURL'>Save</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script lang='babel'>
export default {
  props: {
    connectTo: Function
  },
  data () {
    return {
      dialog: false,
      valid: true,
      url: '',
      rules: {
        required: value => !!value || 'Required.',
        counter: (max) => { return value => value.length <= max || `Max ${max} characters` },
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        sshurl: value => {
          const pattern = /^([^@<>\s,;:]+)@(([a-zA-Z\-0-9]+)(\.[a-zA-Z\-0-9_]+)*)$/
          return pattern.test(value) || 'Invalid ssh url.'
        }
      }
    }
  },
  methods: {
    saveURL () {
      if (this.$refs.urlForm.validate()) {
        this.dialog = false
        const userAndHost = this.url.split('@')
        const user = userAndHost[0]
        const host = userAndHost[1]
        this.connectTo({ sshhost: host, sshuser: user })
      }
    }
  }
}
</script>
