<template>
  <div>
    <q-item link @click.native="clickItem">
      <q-item-side>
        <span>{{atividadeReal.Data  | formatDate}}</span>
      </q-item-side>

      <q-item-main :label="atividadeReal.ClienteProjeto"/>
      
       <q-item-side>
        <span>{{atividadeReal.HoraInicio}}</span>
      </q-item-side>
   
    </q-item>
  </div>
</template>

<script>
//this.filter("formatDate", value => {
//  if (value) {
//    return moment(String(value)).format("DD/MM/YY");
//  }
//});

import moment from "moment";
export default {
  // name: 'ComponentName',
  props: {
    atividadeReal: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    clickItem() {
      this.$emit("clickItem", this.atividadeReal);
    }
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YY");
      }
    }
  }
};
</script>

<style>
</style>
