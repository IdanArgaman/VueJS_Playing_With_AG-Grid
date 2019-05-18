<template>
  <div>
    <input
      style="width:100px"
      :value="params.value.value"
      @input="valueChanged"
      placeholder="edit me"
      :disabled="params.value.isUpdating"
    >
    <!-- The assets folder is included in the bundling process -->
    <img src="@/assets/loader.gif" alt width="20px" height="20px" v-if="params.value.isUpdating">
  </div>
</template>

<script>
import Vue from "vue";
import _ from "lodash";

export default Vue.extend({
  computed: {},
  beforeCreate() {
    this.debounce = _.debounce(event => {
      this.$store.dispatch("patchItem", {
        item: this.params.data,
        patchItem: {
          [this.params.colDef.field]: {
            value: event.target.value
          }
        }
      });
    }, 1000);
  },
  methods: {
    valueChanged(event) {
      this.debounce(event);
    }
  }
});
</script>

<style lang="scss" scoped>
</style>