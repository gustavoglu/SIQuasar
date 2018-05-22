<template>
  <div>
    <q-item link>
      <q-item-main class="q-pa-sm" :label="despesa.TipoDespesa.Descricao"/>
      <q-item-side v-if="despesa.NaoReembolsar" class="q-pa-sm" color="gray">Não Reembolsar</q-item-side>
      <q-item-side right color="green">
        <span>{{'R$ ' + (despesa.Valor.toFixed(2)).replace('.',',') }}</span>
      </q-item-side>
      </q-item>
  </div>
</template>

<script>
import moment from "moment";
export default {
  // name: 'ComponentName',
  props: {
    despesa: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    clickItem() {}
  },
  filters: {
    formatDecimal(value) {
      if (value) {
        return value.toFixed(2);
      }
    }
  }
};
</script>

<style>
</style>
