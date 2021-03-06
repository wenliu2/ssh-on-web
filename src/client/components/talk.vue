<template>
  <v-app>
    <v-toolbar app dense dark>
      <SSHTo @changeOption="changeOption"/>
      <Keys/>
      <Workspaces v-model="optionsArr"/>
      <v-spacer></v-spacer>
      <span style="padding-right: 10px">{{activeOption.connection}}</span>
      <v-icon small color="green" v-if="activeOption.connected">wifi_tethering</v-icon>
      <v-icon small color="red" v-if="!activeOption.connected">portable_wifi_off</v-icon>
      <v-btn
        small
        round
        :disabled="activeOption.connecting"
        :loading="activeOption.connecting"
        v-on:click="connectToggle"
        v-if="activeOption.connection != ''"
      >{{activeOption.connected? "Disconnect" : "Reconnect" }}</v-btn>
      <v-tooltip bottom>
        <v-btn @click="logout" icon slot="activator">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
        <span>Sign Out</span>
      </v-tooltip>
    </v-toolbar>
    <v-navigation-drawer app :mini-variant="navMini" hide-overlay dark>
      <v-toolbar dense dark>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-action>
              <v-btn @click.stop="navMini = !navMini" icon>
                <v-icon>list</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title style="text-align: right">
                <h2>Hello {{auth.nt}}!</h2>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <draggable v-model="optionsArr"/>
    </v-navigation-drawer>
    <v-content>
      <Term
        v-for="option in sortedOptionsArr"
        v-show="option.isActive"
        :isActive="option.isActive"
        :key="option.id"
        :termOptions="option.options"
        v-model="option.connected"
        :navMini.sync="navMini"
        :connecting.sync="option.connecting"
        @changeConnection="changeConnection"
      />
    </v-content>
    <v-dialog dark v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline">{{errMsg.type}}</v-card-title>
        <v-card-text>{{errMsg.text}}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="handleDialogButton">{{errMsg.buttonText}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import GlobalStore from "../global-store";
import SSHTo from "./ssh-to/ssh-to.vue";
import Workspaces from "./workspace/workspace.vue";
import Keys from "./keys/keys.vue";
import Term from "./term/term.vue";
import ls from "local-storage";
import draggable from "./draggable/draggable-wrapper.vue";
import _ from "lodash";
import utils from "../utils/utils";

export default {
  components: {
    SSHTo,
    Keys,
    Term,
    draggable,
    Workspaces
  },
  created() {
    this.optionsArr.push(utils.defaultOptions(this.optionsArr));
  },

  data() {
    return {
      auth: GlobalStore.auth,
      navMini: true,
      options: {},
      optionsArr: [],
      dialog: false,
      errMsg: {
        text: "",
        type: "",
        buttonText: ""
      }
    };
  },

  methods: {
    logout() {
      this.auth.logout();
      ls.clear();
      this.auth.clearToken();
    },
    connectToggle() {
      this.activeOption.connecting = true;
      this.activeOption.connected = !this.activeOption.connected;
    },
    changeOption(options) {
      if (this.activeOption.connected) {
        this.showDialog(
          "Please disconnect current websocket",
          "Alert",
          "Disconnect"
        );
      } else {
        this.activeOption.options = options;
        this.activeOption.connected = true;
        this.activeOption.connecting = true;
      }
      this.navMini = true;
    },
    changeConnection(connection) {
      this.activeOption.connection = connection;
    },
    showDialog(message, type, buttonText) {
      this.dialog = true;
      this.errMsg.text = message;
      this.errMsg.type = type;
      this.errMsg.buttonText = buttonText;
    },
    handleDialogButton() {
      switch (this.errMsg.buttonText) {
        case "Disconnect":
          this.activeOption.connected = false;
          break;
        default:
          break;
      }
      this.dialog = false;
      this.clearDialog();
    },
    clearDialog() {
      this.errMsg = {
        text: "",
        type: "",
        buttonText: ""
      };
    }
  },
  computed: {
    activeTermId() {
      return _.filter(this.optionsArr, o => {
        return o.isActive;
      })[0].id;
    },
    activeOption() {
      return _.find(this.optionsArr, o => {
        return o.isActive;
      });
    },
    sortedOptionsArr() {
      return _.sortBy(this.optionsArr, ["id"]);
    }
  }
};
</script>
