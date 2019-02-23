<template>
  <v-dialog v-bind:value="value" v-on:input="valueChange" max-width="1024px" dark>
    <v-card>
      <v-card-title>
        <span class="headline">Import a New Key</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout row wrap>
              <v-flex xs12 sm6 md6>
                <v-text-field
                  label="Name"
                  v-model="editKey.name"
                  :rules="[rules.required, rules.counter(100)]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field
                  label="Description"
                  v-model="editKey.description"
                  :rules="[rules.required, rules.counter(200)]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-textarea
                  label="Private Key"
                  v-model="editKey.privatekey"
                  :rules="[rules.required, rules.privatekey]"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn flat @click="cancel">Cancel</v-btn>
        <v-btn flat @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UTILS from "../../utils/utils";
export default {
  props: ["value", "inputKey"],
  watch: {
    inputKey(nk) {
      this.editKey = Object.assign({}, nk);
      this.$refs.form.reset();
    }
  },
  methods: {
    valueChange(v) {
      this.$emit("input", v);
    },
    cancel() {
      this.$emit("input", false);
    },
    save() {
      if (this.$refs.form.validate()) {
        this.$emit("input", false);
        this.$emit("save", Object.assign({}, this.editKey));
      }
    }
  },
  data() {
    return {
      valid: true,
      editKey: Object.assign({}, UTILS.defaultKey()),
      rules: UTILS.rules
    };
  }
};
</script>
