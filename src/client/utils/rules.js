export default {
  required: value => !!value || "Required.",
  counter: (max) => { return value => (!value || value.length <= max) || `Max ${max} characters`; },
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Invalid e-mail.";
  },
  sshurl: value => {
    const pattern = /^([^@<>\s,;:]+)@(([a-zA-Z\-0-9]+)(\.[a-zA-Z\-0-9_]+)*)(:\d{1,5})?$/;
    return pattern.test(value) || "Invalid ssh url.";
  },
  privatekey: value => {
    const pattern = /^-----BEGIN RSA PRIVATE KEY-----\r?\n([A-Za-z0-9+/=]{64}\r?\n){0,100}[A-Za-z0-9+/=]{0,64}\r?\n-----END RSA PRIVATE KEY-----\r?\n?$/;
    return pattern.test(value) || "Invalid format of key";
  },
  password: value => {
    return value.length >= 8 || "Min 8 characters";
  },
  verifiedPassword: value => {
    return value.length >= 8 || "Min 8 characters";
  }
};
