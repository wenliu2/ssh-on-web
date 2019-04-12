<template>
  <v-list class="pt-0">
    <draggable
      class="list-group"
      v-model="list"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <v-list-tile
          v-for="item in list"
          :key="item.id"
          :class="item.isActive ? 'list-group-item is-active' : 'list-group-item'"
          @click="changeActive(item)"
        >
          <v-list-tile-action>
            <v-icon>aspect_ratio</v-icon>
          </v-list-tile-action>
          <v-spacer/>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </transition-group>
    </draggable>
    <v-list-tile>
      <v-icon @click="add" style="cursor: pointer" dark>add</v-icon>
    </v-list-tile>
  </v-list>
</template>

<script>
import draggable from "vuedraggable";
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
  data() {
    return {
      drag: false
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
    }
  },
  methods: {
    listClass(item) {
      return item.isActive ? "list-group-item is-active" : "list-group-item";
    },
    add() {
      this.list.push({
        options: {},
        id: this.list.length,
        name: this.list.length,
        isActive: false,
        connected: false,
        connection: ""
      });
    },
    changeActive(item) {
      this.$emit(
        "changeList",
        _.map(this.list, o => {
          if (o.id !== item.id) {
            o.isActive = false;
            return o;
          } else {
            o.isActive = true;
            return o;
          }
        })
      );
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
