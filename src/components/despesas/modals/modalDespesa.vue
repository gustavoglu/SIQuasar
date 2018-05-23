<template>
  <div>
    <q-modal class="q-ma-sm" :content-css="{padding: '20px'}" v-model="open" minimized>
      <q-select class="q-ma-sm" v-model="despesa.Id_TipoDespesa" stack-label="Tipo Despesa" @change="tipoDespesaChange('teste')" :options="tiposDespesaSelect" :select="despesa.Id_TipoDespesa"/>
      <q-input v-if="despesa.Id_TipoDespesa == 'e6eb1d20-b62f-41c9-879d-c7f53f973d27'" class="q-ma-sm" v-model="despesa.Km" type="number" label="Km"/>
      <q-checkbox v-if="despesa.Id_TipoDespesa == 'e6eb1d20-b62f-41c9-879d-c7f53f973d27'"  class="q-ma-sm" v-model="despesa.UseiMeuCarro" label="Usei Meu Carro"/>
      <q-checkbox class="q-ma-sm" v-model="despesa.NaoReembolsar" label="Não Reembolsar"/>
      <q-input class="q-ma-sm" :disable="despesa.Id_TipoDespesa == 'e6eb1d20-b62f-41c9-879d-c7f53f973d27'" v-model="despesa.Valor" type="number" stack-label="Valor"/>
      <q-input class="q-ma-sm" v-model="despesa.Comentarios" type="textarea" stack-label="Comentários"/>
      <q-btn-group  :content-css="{width: '100%'}" >
        <q-btn  color="primary" @click.native="open = false" >Cancelar</q-btn>
        <q-btn color="secondary" >Salvar</q-btn>
      </q-btn-group>
   </q-modal>
  </div>
</template>

<script>
import moment from "moment";
export default {
  // name: 'ComponentName',
  props: {
    despesa: {
      type: Object
    },
    tiposDespesa:{
      type:Array
    },
    valorKm:{
      type:Number
    }
  },
  data() {
    return {
      open: false,
      tiposDespesaSelect:[],
      alteradoParaKm : false
    };
  },
  computed:{
    KmComputed(){
     if(this.despesa.Id_TipoDespesa == 'e6eb1d20-b62f-41c9-879d-c7f53f973d27'){
       return this.despesa.UseiMeuCarro ? this.despesa.Valor = (this.valorKm * this.despesa.Km) : this.valorKm = 0

     }
    }
  },
  methods: {
    clickItem() {},
    createSelectModel(label, value) {
      return { label: label, value: value };
    },
    tipoDespesaChange(id){
      alert(id)
      //if(id == 'e6eb1d20-b62f-41c9-879d-c7f53f973d27')
      //  this.despesa.UseiMeuCarro = true
    },
    createTiposDespesaSelect(projetos) {
      let self = this;
      var tiposDespesaSelect = [];
      this.tiposDespesa.forEach(td => { tiposDespesaSelect.push(self.createSelectModel(td.Descricao, td.Id)); });
      this.tiposDespesaSelect = tiposDespesaSelect;
    },
  },
  filters: {
    formatDecimal(value) {
      if (value) {
        return value.toFixed(2);
      }
    }
  },
  created:function(){
    this.$root.$on('abriModalDespesa', despesa =>{
      if(this.despesa.Id == despesa.Id){
      this.createTiposDespesaSelect()
      this.open = true

      }
    })
  }
};
</script>

<style>
</style>
