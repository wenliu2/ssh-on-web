import rules from "./rules";
import GlobalStore from "../global-store";
import _ from "lodash";
export default {
  defaultHost: defaultHost,
  defaultKey: defaultKey,
  rules: rules,
  fetchHeaders: fetchHeaders,
  authTypeList: ["password", "publickey"],
  defaultOptions: defaultOptions
};

function defaultHost() {
  const host = {
    uuid: "-1",
    url: "",
    group: "",
    authType: "",
    keyHash: ""
  };
  return host;
}

function defaultKey() {
  const key = {
    privatekey: "-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEA1OQbBodj/bEttTZVuWJxwPUsZ8IPdbPD0F6I+hcottV0KmGd\n-----END RSA PRIVATE KEY-----",
    name: "",
    description: ""
  };
  return key;
}

function fetchHeaders() {
  return {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${GlobalStore.auth.token}`
  };
}

function defaultOptions(options) {
  return {
    options: {},
    id: options.length > 0 ? _.maxBy(options, "id").id + 1 : 0,
    name: options.length > 0 ? `New Terminal ${_.maxBy(options, "id").id + 1}` : "New Terminal 0",
    isActive: true,
    connected: false,
    connecting: false,
    connection: ""
  };
}
