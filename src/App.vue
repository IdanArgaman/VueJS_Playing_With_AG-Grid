<template>
  <div id="app">
    <ag-grid-vue
      style="width: 500px; height: 500px;"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="cars"
      rowSelection="multiple"
    ></ag-grid-vue>

    <button @click="changeSet">Change Set</button>
    <button @click="changeSingle">Change Single</button>
    <button @click="testDirectChange">Test Direct Store Change</button>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import makeCellRenderer from "./components/cell.renderer";

export default {
  name: "App",
  data() {
    return {
      columnDefs: null,
      rowData: null
    };
  },

  components: {
    AgGridVue
  },
  computed: {
    ...mapState(["cars"]),
    ...mapGetters(["gridFields"])
  },
  methods: {
    ...mapMutations({
      changeSet: "changeSet"
    }),
    ...mapActions({
      changeSingle: "changeSingle"
    }),
    testDirectChange() {
      // Whould fail because the store is defined with "strict:true"
      this.$store.state.cars[0].make = "Test";
    }
  },

  beforeMount() {
    this.columnDefs = [
      {
        headerName: "Make",
        field: "make",
        cellRendererFramework: makeCellRenderer
      },
      {
        headerName: "Model",
        field: "model",
        valueGetter: params => {
          return params.data[params.colDef.field].value;
        }
      },
      {
        headerName: "Price",
        field: "price",
        valueGetter: params => {
          return params.data[params.colDef.field].value;
        }
      }
    ];
  }
};
</script>

<style>
@import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
