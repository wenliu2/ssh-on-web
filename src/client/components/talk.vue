<template>
  <v-app style="height: 100%">
    <v-toolbar dense dark>
      <v-btn @click.stop="navDrawer = !navDrawer" icon>
        <v-icon>list</v-icon>
      </v-btn>
      <SSHTo @changeOption="changeOption"/>
      <Keys/>
      <v-spacer></v-spacer>
      <span style="padding-right: 10px">{{connection}}</span>
      <v-icon small color="green" v-if="connected">wifi_tethering</v-icon>
      <v-icon small color="red" v-if="!connected">portable_wifi_off</v-icon>
      <v-btn
        small
        round
        v-on:click="connectToggle"
        v-if="connection != ''"
      >{{connected? "Disconnect" : "Reconnect" }}</v-btn>
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
    </v-navigation-drawer>
    <Term :termOptions="options" v-model="connected" @changeConnection="changeConnection"/>
  </v-app>
</template>
<script>
import GlobalStore from "../global-store";
import SSHTo from "./ssh-to/ssh-to.vue";
import Keys from "./keys/keys.vue";
import Term from "./term/term.vue";
import ls from "local-storage";

export default {
  components: {
    SSHTo,
    Keys,
    Term
  },
  mounted() {},

  data() {
    return {
      connection: "",
      auth: GlobalStore.auth,
      options: {},
      navDrawer: false,
      connected: false
    };
  },

  methods: {
    logout() {
      this.auth.logout();
      ls.clear();
      this.auth.clearToken();
    },
    connectToggle() {
      this.connected = !this.connected;
    },
    changeOption(options) {
      if (this.connected) this.connected = false;
      this.options = options;
      this.connected = true;
    },
    changeConnection(connection) {
      this.connection = connection;
    }
  }
};
</script>
