<template>
  <div>
    <q-item link @click.native="clickItem">
     
      <q-item-main class="q-pa-sm" :label="despesa.TipoDespesa.Descricao"/>
    
      <q-item-side v-if="despesa.NaoReembolsar" class="q-pa-sm" color="gray">Não Reembolsar</q-item-side>
    
      <q-item-side right color="green">
        <span>{{'R$ ' + (despesa.Valor.toFixed(2)).replace('.',',') }}</span>
      </q-item-side>
    
    </q-item>

    <despesaModalOffline :despesa="despesa" :tiposDespesa="tipoDespesas" :valorKm="valorKm" @atualizaNovaDespesaOffline="atualizaNovaDespesaOffline($event)" @salvaNovaDespesaOffline="salvaNovaDespesaOffline($event)" @excluiDespesaOffline="excluiDespesaOffline($event)" />
  </div>
</template>

<script>
import moment from "moment";
import despesaModalOffline from 'components/despesas/modals/modalDespesaOffline'
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
      this.$root.$emit('abriModalDespesaOffline',this.despesa);
    },
  excluiDespesaOffline(despesa){
    this.$emit('excluiDespesaOffline',despesa)
  },
  atualizaNovaDespesaOffline(despesa){
    Object.assign(this.despesa,despesa)
    this.$emit('atualizaNovaDespesaOffline',despesa)
  },
  salvaNovaDespesaOffline(despesa){
    this.$emit('salvaNovaDespesaOffline',despesa)
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
    despesaModalOffline
  }
};
</script>

<style>
</style>
