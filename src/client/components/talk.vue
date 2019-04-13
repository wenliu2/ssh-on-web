<template>
  <v-app style="height: 100%">
    <v-toolbar dense dark>
      <v-btn @click.stop="navDrawer = !navDrawer" icon>
        <v-icon>list</v-icon>
      </v-btn>
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
      <v-tooltip bottom>
        <v-btn v-on:click="logout" icon slot="activator">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
        <span>Sign Out</span>
      </v-tooltip>
    </v-toolbar>
    <v-navigation-drawer v-model="navDrawer" absolute dark>
      <v-toolbar dense dark>
        <v-btn @click.stop="navDrawer = !navDrawer" icon>
          <v-icon>list</v-icon>
        </v-btn>
        <v-spacer/>
        <h2>Hello {{auth.nt}}!</h2>
      </v-toolbar>
      <draggable v-model="optionsArr"/>
    </v-navigation-drawer>
    <Term
      v-for="option in sortedOptions"
      v-show="option.isActive"
      :key="option.id"
      :termOptions="option.options"
      v-model="option.connected"
      @changeConnection="changeConnection"
    />
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
      navDrawer: false
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
      if (this.activeOption.connected) this.activeOption.connected = false;
      this.activeOption.options = options;
      this.activeOption.connected = true;
    },
    changeConnection(connection) {
      this.activeOption.connection = connection;
    }
  },
  computed: {
    activeTermId() {
      return _.filter(this.optionsArr, o => {
        return o.isActive;
      })[0].id;
    },
    activeOption() {
      return _.filter(this.optionsArr, o => {
        return o.isActive;
      })[0];
    },
    sortedOptions() {
      return _.sortBy(this.optionsArr, ["id"]);
    }
  }
};
</script>
