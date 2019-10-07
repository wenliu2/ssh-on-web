<template>
  <v-list class="pt-0">
    <draggable
      class="list-group"
      v-model="options"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <v-list-tile
          v-for="item in options"
          :key="item.id"
          :class="item.isActive ? 'list-group-item is-active' : 'list-group-item'"
          @click="changeActive(item)"
        >
          <v-list-tile-action>
            <v-icon :color="item.connected ? 'green' : ''">aspect_ratio</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-icon small @click.stop="showEdit(item)">edit</v-icon>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon
              v-if="options.length > 1 && item.connected === false"
              small
              @click="closeItem(item)"
            >close</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </transition-group>
    </draggable>
    <v-list-tile>
      <v-list-tile-action>
        <v-icon @click="add" style="cursor: pointer" dark>add</v-icon>
      </v-list-tile-action>
    </v-list-tile>
    <v-dialog dark v-model="editDialog" width="500">
      <v-card>
        <v-card-text>
          <!-- make autofocus work -->
          <v-container grid-list-md>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-if="editDialog"
                @keyup.enter="handleEditDialogButton"
                v-model="edit.editText"
                required
                :rules="[rules.required, rules.counter(100)]"
                label="Name:"
                autofocus
              />
              <!-- fix v-form auto refresh with one input -->
              <input style="display: none" />
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="handleEditDialogButton">{{edit.buttonText}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
import draggable from "vuedraggable";
import UTILS from "../../utils/utils";
import _ from "lodash";
export default {
  components: {
    draggable
  },
  model: {
    prop: "list",
    event: "changeList"
  },
  props: ["list"],
  watch: {
    list: function(newList) {
      this.options = newList;
    }
  },
  data() {
    return {
      options: this.list,
      drag: false,
      editDialog: false,
      edit: {
        id: "",
        editText: "",
        buttonText: "OK"
      },
      valid: true,
      rules: UTILS.rules
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    editItem() {
      return (
        _.filter(this.options, o => {
          return o.id === this.edit.id;
        })[0] || null
      );
    }
  },
  methods: {
    add() {
      // const item = {
      //   options: {},
      //   id: _.maxBy(this.options, "id").id + 1,
      //   name: `New Terminal ${_.maxBy(this.options, "id").id + 1}`,
      //   isActive: true,
      //   connected: false,
      //   connecting: false,
      //   connection: ""
      // };
      const item = UTILS.defaultOptions(this.options);
      this.options.push(item);
      this.changeActive(item);
    },
    changeActive(item) {
      this.options = _.map(this.options, o => {
        if (o.id !== item.id) {
          o.isActive = false;
          return o;
        } else {
          o.isActive = true;
          return o;
        }
      });
      this.changePropList(this.options);
    },
    showEdit(item) {
      this.edit.id = item.id;
      this.edit.editText = item.name;
      this.editDialog = true;
    },
    handleEditDialogButton() {
      if (this.valid) {
        this.editItem.name = this.edit.editText;
        this.editDialog = false;
        this.changePropList(this.options);
      }
    },
    closeItem(item) {
      _.remove(this.options, o => {
        return o.id === item.id;
      });
      this.changeActive(this.options[0]); // this is a temp solution.Because it will choose and then delete.In this moment, the active is still the old one in parent. So change to the first one
    },
    changePropList(list) {
      this.$emit("changeList", list);
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: right;
  background-color: #424242;
  border-radius: 5px;
  &.is-active {
    background-color: rgba(255, 255, 255, 0.08);
  }
}
</style>
