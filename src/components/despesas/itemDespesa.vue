<template>
  <div>
    <q-item link @click.native="clickItem">
      <q-item-main class="q-pa-sm" :label="despesa.TipoDespesa.Descricao"/>
      <q-item-side v-if="despesa.NaoReembolsar" class="q-pa-sm" color="gray">Não Reembolsar</q-item-side>
      <q-item-side right color="green">
        <span>{{'R$ ' + (despesa.Valor.toFixed(2)).replace('.',',') }}</span>
      </q-item-side>
      </q-item>

      <despesaModal :despesa="despesa" :tiposDespesa="tipoDespesas" :valorKm="valorKm" @atualizaDespesa="atualizaDespesa($event)" @excluiDespesa="excluiDespesa($event)"/>
  </div>
</template>

<script>
import moment from "moment";
import despesaModal from 'components/despesas/modals/modalDespesa'
export default {
  // name: 'ComponentName',
  props: {
    despesa: {
      type: Object
    },
    tipoDespesas:{
      type:Array
    },
    valorKm:{
      type:Number
    }
  },
  data() {
    return {

    };
  },
  methods: {
    clickItem() {

      this.$root.$emit('abriModalDespesa',this.despesa);
    },
      
  atualizaDespesa(despesa){
    Object.assign(this.despesa,despesa)
    this.$emit('atualizaDespesa',despesa)
  },
  excluiDespesa(despesa){
    this.$emit('excluiDespesa',despesa)
  }
  },
  filters: {
    formatDecimal(value) {
      if (value) {
        return value.toFixed(2);
      }
    }
  },
  components:{
    despesaModal
  }
};
</script>

<style>
</style>
