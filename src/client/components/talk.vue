<template>
  <v-app>
    <v-toolbar app dense dark>
      <SSHTo @changeOption="changeOption"/>
      <Keys/>
      <v-spacer></v-spacer>
      <span style="padding-right: 10px">{{activeOption.connection}}</span>
      <v-icon small color="green" v-if="activeOption.connected">wifi_tethering</v-icon>
      <v-icon small color="red" v-if="!activeOption.connected">portable_wifi_off</v-icon>
      <v-btn
        small
        round
        v-on:click="connectToggle"
        v-if="activeOption.connection != ''"
      >{{activeOption.connected? "Disconnect" : "Reconnect" }}</v-btn>
      <v-tooltip style="margin-left: 5px" bottom>
        <v-btn v-on:click="logout" icon slot="activator">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
        <span>Sign Out</span>
      </v-tooltip>
    </v-toolbar>
    <v-navigation-drawer app :mini-variant="navMini" hide-overlay dark>
      <v-toolbar dense dark>
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
      </v-toolbar>
      <draggable v-model="optionsArr"/>
    </v-navigation-drawer>
    <v-content>
      <Term
        v-for="option in sortedOptions"
        v-show="option.isActive"
        :key="option.id"
        :termOptions="option.options"
        v-model="option.connected"
        :navMini.sync="navMini"
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
import Keys from "./keys/keys.vue";
import Term from "./term/term.vue";
import ls from "local-storage";
import draggable from "./draggable/draggable-wrapper.vue";
import _ from "lodash";

export default {
  components: {
    SSHTo,
    Keys,
    Term,
    draggable
  },
  mounted() {},

  data() {
    return {
      auth: GlobalStore.auth,
      navMini: true,
      options: {},
      optionsArr: [
        {
          options: {},
          id: 0,
          name: "Default",
          isActive: true,
          connected: false,
          connection: ""
        }
      ],
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
      return (
        _.filter(this.optionsArr, o => {
          return o.isActive;
        })[0] || this.optionsArr[0]
      );
    },
    sortedOptions() {
      return _.sortBy(this.optionsArr, ["id"]);
    }
  }
};
</script>
<style lang="scss" scoped>
.v-btn.v-btn--icon.theme--dark {
  margin-left: -12px;
}
</style>
