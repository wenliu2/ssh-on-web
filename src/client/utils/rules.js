export default {
  required: value => !!value || 'Required.',
  counter: (max) => { return value => value.length <= max || `Max ${max} characters` },
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  },
  sshurl: value => {
    const pattern = /^([^@<>\s,;:]+)@(([a-zA-Z\-0-9]+)(\.[a-zA-Z\-0-9_]+)*)$/
    return pattern.test(value) || 'Invalid ssh url.'
  }
}
