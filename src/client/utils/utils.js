import rules from './rules'
import GlobalStore from '../global-store'
export default {
  defaultHost: defaultHost,
  rules: rules,
  fetchHeaders: fetchHeaders
}

function defaultHost () {
  const host = {
    uuid: '-1',
    url: '',
    group: '',
    authType: ''
  }
  return host
}

function fetchHeaders () {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GlobalStore.auth.token}`
  }
}
