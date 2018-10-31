const convict = require('convict')

// Define a schema
var config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "staging"],
    default: "development",
    env: "NODE_ENV"
  },
  ip: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "IP_ADDRESS",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port"
  },
  passport: {
    jwt_secret: {
      doc: "The secret for JWT service",
      format: String,
      default: "qwe123",
      env: "JWT_SECRET"
    }
  },
  db: {
    key_secret: {
      doc: "The secret to protect user defined keys",
      format: String,
      default: "304bccc8724e70f1ec532fa516367194",
      env: "KEY_SECRET"
    },
    url: {
      doc: "db connect string",
      format: '*',
      default: 'mongodb://localhost:27017/toolsdb'
    },
    user: {
      doc: "DB user name",
      format: String,
      default: 'toolsuser'
    },
    password: {
      doc: "DB password",
      format: String,
      default: '12345678'
    }
  }
});

// Load environment dependent configuration
var env = config.get('env');
config.loadFile('./config/' + env + '.json');

// Perform validation
config.validate({allowed: 'strict'});

// module.exports = config;
export default config