<template>
  <v-dialog dark v-model='dialog' fullscreen hide-overlay transition='dialog-bottom-transition'>
    <v-btn slot='activator' class='body-2' flat round small> SSH to </v-btn>
    <v-card>
      <v-toolbar dense>
        <v-btn small icon class='body-2' @click.native="dialog = false">
          <v-icon small>close</v-icon>
        </v-btn>
        <v-toolbar-title class='body-2'>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
          <v-btn small round flat @click.native="dialog = false" class='body-2'>Save</v-btn>
      </v-toolbar>
        <v-container fluid>
          <v-form ref='urlForm' v-model='valid' lazy-validation>
          <v-layout row wrap align-center>
            <v-flex xs12 sm6 md6>
              <v-text-field prepend-icon="security" label='SSH To' :counter='100' v-model='url' required placeholder="user@hostname"
              :rules='[rules.required, rules.counter(100), rules.sshurl]'/>
            </v-flex>
            <v-flex xs12 sm6 md6 align-center>
              <v-btn small round v-on:click='saveURL'>Connect</v-btn>
            </v-flex>
          </v-layout>
          </v-form>

          <v-subheader>Hosts</v-subheader>
          <v-divider></v-divider>
          <v-data-table
            :items='hosts'
            :headers='headers'
          >
            <template slot='items' slot-scope="props">
              <td>{{ props.item.url }}</td>
              <td>{{ props.item.group }}</td>
              <td>{{ props.item.authType }}</td>
              <td class="align-center">
                <v-icon
                  small
                  class="mr-2"
                  v-on:click='editHost(props.item)'
                > edit </v-icon>
                <v-icon
                  small
                  class="mr-2"
                  v-on:click='deleteHost(props.item)'
                > delete </v-icon>
                <v-icon
                  small
                  class="mr-2"
                  v-on:click='selectURL(props.item)'
                > done </v-icon>
              </td>
            </template>
          </v-data-table>
        </v-container>
        <v-btn @click='editorDialog=!editorDialog' class="mb-2">New Host</v-btn>
        <v-btn @click='refresh' class="mb-2">Refresh</v-btn>
        <EditHost v-model='editorDialog' v-on:cancel='closeEditor' v-on:save='saveEditedHost' :host='editedHost'></EditHost>
    </v-card>
  </v-dialog>
</template>
<script lang='babel'>
import EditHost from './edit-host.vue'
import UTILS from '../../utils/utils'
import GlobalStore from '../../global-store'
export default {
  props: {
    connectTo: Function
  },
  components: {
    EditHost
  },
  watch: {
  },

  created () {
    this.refresh()
  },

  data () {
    return {
      auth: GlobalStore.auth,
      defaultHost: UTILS.defaultHost(),
      editedHost: UTILS.defaultHost(),
      editorDialog: false,
      dialog: false,
      valid: true,
      url: '',
      hosts: [],
      headers: [{
        text: 'URL',
        value: 'url'
      }, {
        text: 'Group',
        value: 'group'
      }, {
        text: 'Auth Type',
        value: 'authType'
      }, {
        text: 'Action',
        sortable: false
      }],
      rules: UTILS.rules,
      itemIndex: -1
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
    },

    refresh () {
      fetch('/api/hosts', {
        headers: UTILS.fetchHeaders(),
        method: 'GET'
      }).then((res) => {
        if (res.ok) {
          res.json().then(hosts => { this.hosts = hosts })
        } else {
          console.log('res:', res)
        }
      }).catch((err) => {
        console.error(err)
      })
    },

    selectURL (item) {
      this.dialog = false
      const userAndHost = item.url.split('@')
      const user = userAndHost[0]
      const host = userAndHost[1]
      this.connectTo({ sshhost: host, sshuser: user })
    },

    editHost (item) {
      this.editedHost = Object.assign({}, item)
      this.editorDialog = true
    },

    deleteHost (item) {
      if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/api/host/${item.uuid}`, {
          headers: UTILS.fetchHeaders(),
          method: 'DELETE'
        }).then(res => {
          if (res.ok) {
            res.json().then(uuid => {
              const index = this.hosts.findIndex(host => uuid.uuid === host.uuid)
              if ( index !== -1 ) this.hosts.splice(index, 1)
            })
          } else {
            console.error(res)
          }
        }).catch( err => {
          console.error(err)
        })
      }
    },

    saveEditedHost (host) {
      if (host.uuid && host.uuid !== '-1') {
        // Object.assign(this.hosts[this.editedHostIndex], host)
        fetch('/api/host', {
          headers: UTILS.fetchHeaders(),
          body: JSON.stringify(host),
          method: 'POST'
        }).then((res) => {
          if (res.ok) {
            res.json().then( uuid => {
              const index = this.hosts.findIndex( host => host.uuid === uuid.uuid )
              if ( index !== -1 ) Object.assign(this.hosts[index], host)
            })
          } else {
            console.error('res:', res)
          }
        }).catch((err) => {
          console.error(err)
        })
      } else {
        fetch('/api/host', {
          headers: UTILS.fetchHeaders(),
          body: JSON.stringify(host),
          method: 'PUT'
        }).then((res) => {
          if (res.ok) {
            res.json().then(host => this.hosts.push(host))
          } else {
            console.error('res:', res)
          }
        }).catch((err) => {
          console.error(err)
        })
      }
      this.closeEditor()
    },

    closeEditor () {
      setTimeout(() => {
        this.editedHost = Object.assign({}, this.defaultHost)
        // this.editedHostIndex = -1
      }, 300)
    }
  }
}
</script>
