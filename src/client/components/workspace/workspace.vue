<template>
  <v-dialog dark v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-btn slot="activator" class="body-2" flat round small>Workspaces</v-btn>
    <v-layout row>
      <v-flex sx12 sm6 offset-sm3>
        <v-card>
          <v-toolbar dense>
            <v-btn small icon class="body-2" @click.native="dialog = false">
              <v-icon small>close</v-icon>
            </v-btn>
            <v-toolbar-title class="body-2">Workspace Management</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn small round flat @click.native="dialog = false" class="body-2">Close</v-btn>
          </v-toolbar>
          <v-container fluid>
            <v-list>
              <v-list-tile v-for="workspace in workspaces" :key="workspace.uuid" avator>
                <v-list-tile-avatar>
                  <v-icon small>assignment</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ workspace.name }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon ripple @click="deleteWorkspace(workspace)">
                    <v-icon small>delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-action>
                  <v-btn icon ripple @click="applyWorkspace(workspace)">
                    <v-icon small>done</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-dialog dark v-model="editDialog" width="500">
              <template v-slot:activator="{ on }">
                <v-btn @click="onClickNewWorkspace">New Workspace</v-btn>
              </template>
              <v-card>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-layout row wrap>
                        <v-flex xs12 sm12 md12>
                          <v-text-field
                            v-if="editDialog"
                            @keyup.enter="newWorkspace"
                            v-model="workspace.name"
                            required
                            :rules="[rules.required, rules.counter(100)]"
                            label="Name:"
                            autofocus
                          />
                          <!-- fix v-form auto refresh with one input -->
                          <input style="display: none">
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-container>
                  <!-- make autofocus work -->
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="newWorkspace">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-dialog>
</template>

<script>
import UTILS from "../../utils/utils";
import _ from "lodash";
export default {
  model: {
    prop: "options",
    event: "change"
  },
  props: ["options"],
  watch: {
    dialog(v, ov) {
      // refresh list from db if dialog is shown
      if (v) this.refresh();
    }
  },

  methods: {
    onClickNewWorkspace() {
      this.workspace.options = this.options;
      this.editDialog = !this.editDialog;
    },
    newWorkspace() {
      if (this.$refs.form.validate()) {
        fetch("/api/workspace", {
          headers: UTILS.fetchHeaders(),
          method: "PUT",
          body: JSON.stringify(this.workspace)
        })
          .then(res => {
            if (res.ok) return res.json();
            return Promise.reject(res);
          })
          .then(json => {
            this.workspace.uuid = json.uuid;
            this.workspaces.push(Object.assign({}, this.workspace));
          })
          .catch(err => {
            console.error(err);
          })
          .then(() => {
            this.editDialog = false;
          });
      }
    },

    deleteWorkspace(workspace) {
      fetch(`/api/workspace/${workspace.uuid}`, {
        headers: UTILS.fetchHeaders(),
        method: "DELETE"
      })
        .then(res => {
          if (res.ok) return res.json();
          return Promise.reject(res);
        })
        .then(json => {
          const index = this.workspaces.findIndex(
            k => k.uuid === workspace.uuid
          );
          if (index !== -1) this.workspaces.splice(index, 1);
        })
        .catch(err => {
          console.error(err);
        });
    },
    applyWorkspace(workspace) {
      _.each(workspace.options, function(o) {
        if (o.connected) o.connected = false;
      });
      this.$emit("change", workspace.options);
      this.dialog = false;
    },
    refresh() {
      fetch("/api/workspaces", {
        headers: UTILS.fetchHeaders(),
        method: "GET"
      })
        .then(res => {
          if (res.ok) return res.json();
          Promise.reject(res);
        })
        .then(workspaces => {
          this.workspaces = workspaces;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, // methods

  data() {
    return {
      valid: true,
      rules: UTILS.rules,
      workspaces: [],
      dialog: false,
      editDialog: false,
      workspace: {
        name: "",
        uuid: "",
        options: []
      }
    };
  }
};
</script>
