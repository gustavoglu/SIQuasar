<template>
  <div>
    <q-item link @click.native="clickItem">
      <q-item-side left>
        <q-icon name="date_range"></q-icon>
        <span>{{atividadeReal.Data  | formatDate}}</span>
      </q-item-side>

      <q-icon name="chevron_right"/>
      <q-item-main :label="atividadeReal.ClienteProjeto"/>
      
       <q-item-side right>
         
         <q-item-tile>
           <q-icon name="play_circle_outline"/>
          <span>{{atividadeReal.HoraInicio | formatHours}}</span>
         </q-item-tile>

          <q-item-tile>
            <q-icon name="stop"/>
            <span>{{atividadeReal.HoraFim | formatHours}}</span>
         </q-item-tile>

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
import { date } from "quasar";
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
      this.$root.$emit("abriModalEditAtividade", this.atividadeReal.Id);
    }
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YY");
      }
    },
    formatHours(value) {
      if (value) return value.slice(0,5)
    }
  }
};
</script>

<style>
</style>
