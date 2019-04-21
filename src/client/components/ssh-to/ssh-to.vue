<template>
  <v-dialog dark v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-btn slot="activator" class="body-2" flat round small>SSH to</v-btn>
    <v-card>
      <v-toolbar dense>
        <v-btn small icon class="body-2" @click.native="dialog = false">
          <v-icon small>close</v-icon>
        </v-btn>
        <v-toolbar-title class="body-2">Host Management</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn small round flat @click.native="dialog = false" class="body-2">Close</v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-form ref="urlForm" v-model="valid" lazy-validation>
          <v-layout row wrap align-center>
            <v-flex xs12 sm6 md6>
              <v-text-field
                v-if="dialog"
                autofocus
                prepend-icon="security"
                label="SSH To"
                :counter="100"
                v-model="url"
                required
                placeholder="user@hostname:port"
                :rules="[rules.required, rules.counter(100), rules.sshurl]"
                @keyup.enter="saveURL"
              />
              <!-- fix v-form auto refresh with one input -->
              <input style="display: none">
            </v-flex>
            <v-flex xs12 sm6 md6 align-center>
              <v-btn small round @click="saveURL">Connect</v-btn>
            </v-flex>
          </v-layout>
        </v-form>

        <v-subheader>Hosts</v-subheader>
        <v-divider></v-divider>
        <v-card>
          <v-card-title>
            <v-spacer/>
            <v-spacer/>
            <v-spacer/>
            <v-spacer/>
            <v-text-field v-model="search" append-icon="search" label single-line hide-details></v-text-field>
          </v-card-title>

          <v-data-table
            :items="hosts"
            :headers="headers"
            :search="search"
            hide-actions
            :loading="backendLoading"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.url }}</td>
              <td>{{ props.item.group }}</td>
              <td>{{ props.item.authType }}</td>
              <td>{{ keyName(props.item.authType, props.item.keyHash) }}</td>
              <td class="align-center">
                <v-icon small class="mr-2" v-on:click="editHost(props.item)">edit</v-icon>
                <v-icon small class="mr-2" v-on:click="deleteHost(props.item)">delete</v-icon>
                <v-icon small class="mr-2" v-on:click="selectURL(props.item)">done</v-icon>
              </td>
            </template>
            <v-alert
              dark
              slot="no-results"
              :value="true"
              color="warning"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </v-data-table>
        </v-card>
      </v-container>
      <v-btn @click="newHostOnClick" class="mb-2">New Host</v-btn>
      <v-btn @click="refresh" class="mb-2">Refresh</v-btn>
      <EditHost
        v-model="editorDialog"
        v-on:cancel="closeEditor"
        v-on:save="saveEditedHost"
        :host="editedHost"
        :keys="keys"
      ></EditHost>
    </v-card>
  </v-dialog>
</template>

<script>
import EditHost from "./edit-host.vue";
import UTILS from "../../utils/utils";
import GlobalStore from "../../global-store";
export default {
  components: {
    EditHost
  },
  watch: {
    dialog(v) {
      if (v) this.refresh();
    }
  },

  mounted() {
    // this.refresh()
  },

  data() {
    return {
      backendLoading: false,
      search: "",
      keys: [],
      auth: GlobalStore.auth,
      defaultHost: UTILS.defaultHost(),
      editedHost: UTILS.defaultHost(),
      editorDialog: false,
      dialog: false,
      valid: true,
      url: "",
      hosts: [],
      headers: [
        { text: "URL", value: "url" },
        { text: "Group", value: "group" },
        { text: "Auth Type", value: "authType" },
        { text: "Key Name", value: "key" },
        { text: "Action", sortable: false }
      ],
      rules: UTILS.rules,
      itemIndex: -1,
      defaultSSHOptions: {
        PreferredAuthentications: "password,keyboard-interactive",
        ServerAliveInterval: "60"
      }
    };
  },
  methods: {
    keyName(authType, keyHash) {
      if (authType !== "publickey") return "N/A";
      const index = this.keys.findIndex(key => keyHash === key.hash);
      if (index === -1) return "N/A";
      return this.keys[index].name;
    },

    parseSSHUrl(url) {
      const userAndHost = url.split(/(?:[@:]+)/);
      const user = userAndHost[0];
      const host = userAndHost[1];
      const port = userAndHost[2] || "22";
      return { user, host, port };
    },

    saveURL() {
      if (this.$refs.urlForm.validate()) {
        this.dialog = false;
        const { user, host, port } = this.parseSSHUrl(this.url);
        const options = Object.assign({}, this.defaultSSHOptions, {
          sshuser: user,
          sshhost: host,
          sshport: port
        });
        document.title = this.url;
        this.$emit("changeOption", options);
      }
    },

    refresh() {
      this.$refs.urlForm.resetValidation();
      const headers = UTILS.fetchHeaders();
      this.backendLoading = true;
      UTILS.fetch("/api/hosts", {
        headers: headers,
        method: "GET"
      })
        .then(hosts => {
          this.backendLoading = false;
          this.hosts = hosts;
        })
        .catch(err => {
          this.backendLoading = false;
          console.error(err);
        });

      UTILS.fetch("/api/keys", {
        headers: headers,
        method: "GET"
      })
        .then(keys => {
          this.backendLoading = false;
          this.keys = keys.map(key => {
            return { name: key.name, hash: key.hash };
          });
        })
        .catch(err => {
          this.backendLoading = false;
          console.error(err);
        });
    },

    selectURL(item) {
      this.dialog = false;
      const { user, host, port } = this.parseSSHUrl(item.url);
      const options = {
        sshhost: host,
        sshuser: user,
        sshport: port
      };
      options.PreferredAuthentications = item.authType;
      document.title = item.url;
      this.$emit(
        "changeOption",
        Object.assign({}, this.defaultSSHOptions, item, options)
      );
    },

    editHost(item) {
      this.editedHost = Object.assign({}, item);
      this.editorDialog = true;
    },

    deleteHost(item) {
      if (confirm("Are you sure you want to delete this item?")) {
        this.backendLoading = true;
        UTILS.fetch(`/api/host/${item.uuid}`, {
          headers: UTILS.fetchHeaders(),
          method: "DELETE"
        })
          .then(uuid => {
            this.backendLoading = false;
            const index = this.hosts.findIndex(host => uuid.uuid === host.uuid);
            if (index !== -1) this.hosts.splice(index, 1);
          })
          .catch(err => {
            this.backendLoading = false;
            console.error(err);
          });
      }
    },

    saveEditedHost(host) {
      this.backendLoading = true;
      if (host.uuid && host.uuid !== "-1") {
        // existing host, update it
        UTILS.fetch("/api/host", {
          headers: UTILS.fetchHeaders(),
          body: JSON.stringify(host),
          method: "POST"
        })
          .then(uuid => {
            this.backendLoading = false;
            const index = this.hosts.findIndex(h => h.uuid === uuid.uuid);
            if (index !== -1) {
              this.hosts.splice(index, 1, Object.assign({}, host));
            }
          })
          .catch(err => {
            this.backendLoading = false;
            console.error(err);
          });
      } else {
        // new host, add it
        UTILS.fetch("/api/host", {
          headers: UTILS.fetchHeaders(),
          body: JSON.stringify(host),
          method: "PUT"
        })

          .then(host => {
            this.backendLoading = false;
            this.hosts.push(host);
          })
          .catch(err => {
            this.backendLoading = false;
            console.error(err);
          });
      }
      this.closeEditor();
    },

    closeEditor() {
      setTimeout(() => {
        this.editedHost = Object.assign({}, this.defaultHost);
        // this.editedHostIndex = -1
      }, 300);
    },
    newHostOnClick() {
      this.$refs.urlForm.resetValidation();
      this.editorDialog = !this.editorDialog;
    }
  }
};
</script>
