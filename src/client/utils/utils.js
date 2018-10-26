import rules from './rules'
import GlobalStore from '../global-store'
export default {
  defaultHost: defaultHost,
  defaultKey: defaultKey,
  rules: rules,
  fetchHeaders: fetchHeaders,
  authTypeList: ['password', 'publickey']
}

function defaultHost () {
  const host = {
    uuid: '-1',
    url: '',
    group: '',
    authType: '',
    keyHash: ''
  }
  return host
}

function defaultKey () {
  const key = {
    privatekey: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEA1OQbBodj/bEttTZVuWJxwPUsZ8IPdbPD0F6I+hcottV0KmGd\n-----END RSA PRIVATE KEY-----',
    name: '',
    description: ''
  }
  return key
}

function fetchHeaders () {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GlobalStore.auth.token}`
  }
}
