<template>
  <div>
    <q-modal no-backdrop-dismiss  @escape-key="cancelar"  class="q-ma-sm" :content-css="{padding: '20px'}" v-model="open" minimized>
      <q-select :error="$v.despesaMutavel.Id_TipoDespesa.$error" class="q-ma-sm" v-model="despesaMutavel.Id_TipoDespesa" stack-label="Tipo Despesa" :options="tiposDespesaSelect" :select="despesaMutavel.Id_TipoDespesa"/>
      <q-input v-if="despesaMutavel.Id_TipoDespesa == 'e6eb1d20-b62f-41c9-879d-c7f53f973d27'" class="q-ma-sm" v-model="despesaMutavel.Km" type="number" stack-label="Km"/>
      <q-checkbox v-if="despesaMutavel.Id_TipoDespesa == 'e6eb1d20-b62f-41c9-879d-c7f53f973d27'"  class="q-ma-sm" v-model="despesaMutavel.UseiMeuCarro" label="Usei Meu Carro"/>
      <q-checkbox class="q-ma-sm" v-model="despesaMutavel.NaoReembolsar" label="Não Reembolsar"/>
      <q-input :error="$v.despesaMutavel.Valor.$error" class="q-ma-sm" v-if="despesaMutavel.Id_TipoDespesa != 'e6eb1d20-b62f-41c9-879d-c7f53f973d27'" v-model="despesaMutavel.Valor" type="number" stack-label="Valor"/>
      <q-input class="q-ma-sm" disable v-model="KmComputed" type="number" stack-label="Valor" v-if="despesaMutavel.Id_TipoDespesa == 'e6eb1d20-b62f-41c9-879d-c7f53f973d27'"/>
      <q-input class="q-ma-sm"  v-model="despesaMutavel.Comentarios" type="textarea" stack-label="Comentários"/>
      <q-btn-group  :content-css="{width: '100%'}" >
        <q-btn  color="negative" @click.native="excluir" >Excluir</q-btn>
        <q-btn  color="primary" @click.native="cancelar" >Cancelar</q-btn>
        <q-btn color="secondary" @click.native="salvar">Salvar</q-btn>
      </q-btn-group>
   </q-modal>
  </div>
</template>

<script>
import moment from "moment";
import { required } from "vuelidate/lib/validators";
import axios from 'axios'
import {LocalStorage ,Loading} from 'quasar'
export default {
  // name: 'ComponentName',
  props: {
    despesa: {
      type: Object
    },
    tiposDespesa: {
      type: Array
    },
    valorKm: {
      type: Number
    }
  },
  data() {
    return {
      open: false,
      alteradoParaKm: false,
      despesaSemAlteracoes: {},
      despesaMutavel: {
        Id_TipoDespesa: "",
        UseiMeuCarro: false,
        NaoReembolsar: false,
        Km: 0,
        Valor: 0
      },
      valorCalcKm : 0
    };
  },
  validations: {
    despesaMutavel: {
      Id_TipoDespesa: { required },
      Valor: { required }
    }
  },
  computed: {
    KmComputed (){
        if ( this.despesaSemAlteracoes.Id_TipoDespesa != "e6eb1d20-b62f-41c9-879d-c7f53f973d27" && this.despesaMutavel.Id_TipoDespesa == "e6eb1d20-b62f-41c9-879d-c7f53f973d27"){
        this.despesaMutavel.Valor = 0
        this.valorCalcKm = 0
        }

      if (this.despesaMutavel.Id_TipoDespesa == "e6eb1d20-b62f-41c9-879d-c7f53f973d27") {
        if (this.despesaMutavel.Km != null && this.despesaMutavel.UseiMeuCarro && this.despesaMutavel.Km > 0)  {
        this.valorCalcKm = (this.valorKm * this.despesaMutavel.Km) 
        this.despesaMutavel.Valor = this.valorCalcKm
        return this.valorCalcKm
        }
        else{
        this.valorCalcKm = 0
        this.despesaMutavel.Valor = this.valorCalcKm
        return 0
        }
    }
    },
   
    tiposDespesaSelect() {
      let self = this;
      var tiposDespesaSelect = [];
      this.tiposDespesa.forEach(td => {
        tiposDespesaSelect.push(self.createSelectModel(td.Descricao, td.Id));
      });

      return tiposDespesaSelect;
    }
  },
  methods: {
    clickItem() {},
    excluir(){
      this.$q.dialog({title:'Atenção', ok:'Confirmar',cancel:'Cancelar',message:'Tem certeza que deseja excluir esta despesa ?'})
      .then(()=>{
          let token = LocalStorage.get.item("accessToken");
          if (!token) window.location = "/login";
          let config = {
            headers: {
              Authorization: "bearer " + token,
              "content-type": "application/json"
            }
          };
          Loading.show()
            axios.delete('http://localhost:53084/api/despesas/' + this.despesaMutavel.Id,config)
          .then((response)=>{
            this.$emit('excluiDespesa',this.despesaMutavel)
            Loading.hide()
            this.open = false
            this.$q.notify({type:'positive',message:'Despesa Removida'})
          }).catch((error)=>{
            Loading.hide()
            this.$q.notify({type:'negative',message:'Algo deu errado ao tentar excluir a Despesa'})
          })
      })
      .catch(()=>{
      
      })
    },
    salvar(){
      let token = LocalStorage.get.item("accessToken");
      if (!token) window.location = "/login";
      let config = {
        headers: {
          Authorization: "bearer " + token,
          "content-type": "application/json"
        }
      };

      Loading.show()
      axios.put('http://localhost:53084/api/despesas/',this.despesaMutavel,config)
      .then((response)=>{
        this.$emit('atualizaDespesa',response.data)
        Loading.hide()
        this.open = false
        this.$q.notify({type:'positive',message:'Despesa Atualizada'})
      }).catch((error)=>{
        Loading.hide()
        this.$q.notify({type:'negative',message:'Algo deu errado ao tentar atualizar a Despesa'})
      })
    },
    inputValor(valor){
      
    },
    createSelectModel(label, value) {
      return { label: label, value: value };
    },
     Validate() {
      this.$v.despesaMutavel.$touch();
      if (this.$v.despesaMutavel.$error) {
        this.$q.notify({
          message: "Existem campos obrigatórios não preenchidos",
          type: "negative"
        });
        return false;
      }
      return true;
    },
    tipoDespesaChange(id) {
      alert(id);
      //if(!(id == 'e6eb1d20-b62f-41c9-879d-c7f53f973d27' && this.despesaMutavel.Km > 0))
      //  this.despesaMutavel.UseiMeuCarro = true
    },
    cancelar() {
      this.open = false;
      Object.assign(this.despesaMutavel, this.despesaSemAlteracoes);
    }
  },
  filters: {
    formatDecimal(value) {
      if (value) {
        return value.toFixed(2);
      }
    }
  },
  created: function() {
    this.$root.$on("abriModalDespesa", despesa => {
      if (this.despesa.Id == despesa.Id) {
        Object.assign(this.despesaSemAlteracoes, this.despesa);
        Object.assign(this.despesaMutavel, this.despesa);
        this.open = true;
        this.id_TipoDespesaOld = this.despesa.Id_TipoDespesa;
      }
    });
  }
};
</script>

<style>
</style>
