<template>
<v-dialog v-bind:value="value" v-on:input='valueChange' max-width="1024px" dark>
  <!--
  <v-btn slot="activator" class="mb-2">New Host</v-btn>
  -->
  <v-card>
    <v-card-title><span class='headline'> New Host </span></v-card-title>
    <v-card-text>
     <v-container grid-list-md>
       <v-form ref='form' v-model='valid' lazy-validation>
       <v-layout row wrap>
         <v-flex xs12 sm6 md6>
           <v-text-field v-model="editHost.url" label="URL"
           :rules='[rules.required, rules.counter(100), rules.sshurl]'
           ></v-text-field>
         </v-flex>
         <v-flex xs12 sm6 md6>
           <v-text-field v-model="editHost.group" label="Group"
           :rules='[rules.required, rules.counter(100)]'
           ></v-text-field>
         </v-flex>
         <v-flex xs12 sm6 md4>
           <v-select v-model="editHost.authType" label="Auth Type" :items='authTypeList'></v-select>
         </v-flex>
         <v-flex xs12 sm6 md4 v-if='editHost.authType === "publickey"'>
           <v-select v-model="editHost.keyHash" label='Key' :items='keys' item-text='name' item-value='hash'></v-select>
         </v-flex>
       </v-layout>
       </v-form>
     </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click='cancel' >Cancel</v-btn>
      <v-btn flat @click='save' >Save</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script lang='babel'>
import UTILS from '../../utils/utils'
export default {
  props: ['value', 'host', 'keys'],
  watch: {
    host ( v ) {
      this.editHost = JSON.parse(JSON.stringify(v)) // Object.assign({}, v)
    }
  },
  methods: {
    valueChange (v) {
      this.$emit('input', v)
      if ( !v ) {
        this.$emit('cancel', 'closed')
      }
    },
    cancel () {
      this.$emit('input', false)
      this.$emit('cancel', 'closed')
    },
    save () {
      if (this.$refs.form.validate()) {
        this.$emit('input', false)
        this.$emit('save', Object.assign({}, this.editHost))
      }
    }
  },
  data () {
    return {
      authTypeList: UTILS.authTypeList,
      valid: true,
      editHost: UTILS.defaultHost(),
      rules: UTILS.rules
    }
  }
}
</script>
