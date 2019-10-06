const convict = require('convict')
const fs = require('fs')

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
  ssl: {
    on: {
      doc: "The http is encrypt or not",
      format: "Boolean",
      default: false,
      env: "SSL_SETTING"
    },
    key_path: {
      doc: "The SSL Key Path",
      format: String,
      default: "./ssl/key.pem",
      env: "SSL_KEY"
    },
    cert_path: {
      doc: "The SSL CERT PATH",
      format: String,
      default: "./ssl/cert.pem",
      env: "SSL_CERT"
    }
  },
  passport: {
    jwt_secret: {
      doc: "The secret for JWT service",
      format: String,
      default: "qwe123",
      env: "JWT_SECRET"
    },
    max_age: {
      doc: "The max age for JWT service",
      format: String,
      default: "30m",
      env: "JWT_MAX_AGE"
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
      default: 'mongodb://localhost:27017/toolsdb',
      env: "MONGODB_URL"
    },
    user: {
      doc: "DB user name",
      format: String,
      default: 'toolsuser',
      env: "MONGODB_USER"
    },
    password: {
      doc: "DB password",
      format: String,
      default: '12345678',
      env: "MONGODB_PASSWD"
    }
  }
});

// Load environment dependent configuration
var env = config.get('env');

if (fs.existsSync('./config/' + env + '.json')) {
  config.loadFile('./config/' + env + '.json');
}

// Perform validation
config.validate({
  allowed: 'strict'
});

// module.exports = config;
export default config