<template>
  <v-dialog dark v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-btn slot="activator" class="body-2" flat round small>Keys</v-btn>
    <v-layout row>
      <v-flex sx12 sm6 offset-sm3>
        <v-card>
          <v-toolbar dense>
            <v-btn small icon class="body-2" @click.native="dialog = false">
              <v-icon small>close</v-icon>
            </v-btn>
            <v-toolbar-title class="body-2">Key Management</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn small round flat @click.native="dialog = false" class="body-2">Close</v-btn>
          </v-toolbar>
          <v-container fluid>
            <v-list>
              <v-list-tile v-for="key in keys" :key="key.hash" avator>
                <v-list-tile-avatar>
                  <v-icon small>vpn_key</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ key.name }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ key.description }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon ripple @click="deleteKey(key)">
                    <v-icon small>delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-btn @click="editDialog=!editDialog">New Key</v-btn>
            <EditKey v-model="editDialog" v-on:save="saveEditKey" :input-key="editKey"/>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-dialog>
</template>

<script>
import UTILS from "../../utils/utils";
import EditKey from "./edit-key.vue";
import GlobalStore from "../../global-store";
export default {
  components: {
    EditKey
  },
  watch: {
    dialog(v, ov) {
      // refresh list from db if dialog is shown
      if (v) this.refresh();
    },

    editDialog(v) {
      // if edit dialog is closed, call close
      if (!v) this.closeEditKey();
    }
  },

  methods: {
    saveEditKey(key) {
      fetch("/api/key", {
        headers: UTILS.fetchHeaders(),
        method: "PUT",
        body: JSON.stringify(key)
      })
        .then(res => {
          if (res.ok) return res.json();
          else if (res.status === 401) {
            GlobalStore.auth.expired();
          }
          return Promise.reject(res);
        })
        .then(json => {
          key.hash = json.hash;
          this.keys.push(Object.assign({}, key));
        })
        .catch(err => {
          console.error(err);
        });
    },

    closeEditKey() {
      setTimeout(() => {
        this.editKey = Object.assign({}, this.defaultKey);
      }, 300);
    },

    deleteKey(key) {
      fetch(`/api/key/${key.hash}`, {
        headers: UTILS.fetchHeaders(),
        method: "DELETE"
      })
        .then(res => {
          if (res.ok) return res.json();
          else if (res.status === 401) {
            GlobalStore.auth.expired();
          }
          return Promise.reject(res);
        })
        .then(json => {
          const index = this.keys.findIndex(k => k.hash === key.hash);
          if (index !== -1) this.keys.splice(index, 1);
        })
        .catch(err => {
          console.error(err);
        });
    },
    refresh() {
      fetch("/api/keys", {
        headers: UTILS.fetchHeaders(),
        method: "GET"
      })
        .then(res => {
          if (res.ok) return res.json();
          else if (res.status === 401) {
            GlobalStore.auth.expired();
          }
          Promise.reject(res);
        })
        .then(keys => {
          this.keys = keys;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, // methods

  data() {
    return {
      editDialog: false,
      keys: [],
      dialog: false,
      editKey: UTILS.defaultKey(),
      defaultKey: UTILS.defaultKey()
    };
  }
};
</script>
