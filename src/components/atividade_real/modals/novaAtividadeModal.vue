<template>
  <div>
    <q-modal v-model="open" maximized>
       <q-layout view="lHh Lpr lFf">
         <q-toolbar color="secondary">
           <q-toolbar-title>Nova Atividade</q-toolbar-title>
           <q-btn flat icon="close" @click.native="fechaModal"></q-btn>
         </q-toolbar>
        
        <q-tabs color="secondary"  align="justify" >
          
          <q-tab default slot="title" name="atividade" icon="play_arrow" >Atividade</q-tab>
          <q-tab slot="title" name="despesas"  icon="monetization_on" >Despesas</q-tab>
          
          <q-tab-pane name="atividade">
           
            <div class="row">
              <q-select :error="$v.atividadeNova.Id_Projeto.$error"  class="q-pa-sm col" v-model="atividadeNova.Id_Projeto" :options="projetosSelect" :select="atividadeNova.Id_Projeto" float-label="Projeto"/>
              <q-select :error="$v.atividadeNova.Id_TipoAtividade.$error"  class="q-pa-sm col" v-model="atividadeNova.Id_TipoAtividade" :options="tiposAtividadeSelect" :select="atividadeNova.Id_TipoAtividade" float-label="Tipo Atividade"/>
            </div>
           
            <q-datetime :error="$v.atividadeNova.Data.$error"  class="q-pa-sm" v-model="atividadeNova.Data" format="DD/MM/YYYY" type="date" @change="val =>{model = val}" stack-label="Data"/>
           
            <div class="row">
              <q-datetime :error="$v.atividadeNova.HoraInicio.$error"  class="q-pa-sm col" v-model="atividadeNova.HoraInicio" format24h  type="time" @change="val =>{model = val}" stack-label="Hora Inicio"/>
              <q-datetime :error="$v.atividadeNova.HoraFim.$error"   class="q-pa-sm col" v-model="atividadeNova.HoraFim" format24h type="time" @change="val =>{model = val}" stack-label="HoraFim"/>
            <q-input  class="q-pa-sm col" clearable v-model="atividadeNova.TempoImprodutivo" stack-label="Almoço(min)" type="number" placeholder="Almoço(min)"/>
            </div>
           
      
            <q-input  class="q-pa-sm" clearable v-model="atividadeNova.Comentarios" stack-label="Comentarios" type="textarea" placeholder="Comentarios"/>
            <q-input  class="q-pa-sm" clearable v-model="atividadeNova.ChamadosJira" stack-label="ChamadosJira" type="textarea" placeholder="ChamadosJira"/>
            <q-input   :error="$v.atividadeNova.DescAtividades.$error" class="q-pa-sm" clearable v-model="atividadeNova.DescAtividades"  stack-label="Desc. Atividades" type="textarea" placeholder="Desc. Atividades"/>
          
          </q-tab-pane>
          
          <q-tab-pane name="despesas">
  
            <q-layout>
              
              <q-btn label="Nova Despesa" color="secondary" @click.native="addNovaDespesa"></q-btn>
              <q-list separator no-border>
                <!--<div v-for="despesa in despesas ">
                  <despesaItem :despesa="despesa" :tipoDespesas="tiposDespesa" :valorKm="atividade.valorKm" />
                </div>-->
              </q-list>

              <!--<despesaModal :despesa="novaDespesa" :tiposDespesa="tiposDespesa" :valorKm="valorKm" />-->
           
            </q-layout>
    
          </q-tab-pane>
          
        </q-tabs>

        <q-layout-footer>
          <q-toolbar color="secondary">
            <q-btn  flat label="Salvar" @click.native="salvar"/>
          </q-toolbar>
        </q-layout-footer>
      
       </q-layout>
    </q-modal>

  </div>
</template>

<script>
//this.filter("formatDate", value => {
//  if (value) {
//    return moment(String(value)).format("DD/MM/YY");
//  }
//});

import moment from "moment";
import axios from "axios";
import { required, email } from "vuelidate/lib/validators";
import { date, LocalStorage, Loading } from "quasar";
export default {
  data() {
    return {
      open: false,
      atividadeLimpa: {},
      atividadeNova: {
        Id: null,
        Id_TipoAtividade: "",
        Id_Projeto: "",
        Data: Date.now(),
        HoraInicio: Date.now(),
        HoraFim: Date.now(),
        Comentarios: "",
        DescAtividades: "",
        ChamadosJira: "",
        TempoImprodutivo: ""
      },
      despesas: [],
      tiposAtividade: [],
      tiposDespesa: [],
      projetos: [],
      valorKm: 0
    };
  },
  validations: {
    atividadeNova: {
      Data: { required },
      HoraInicio: { required },
      HoraFim: { required },
      DescAtividades: { required },
      Id_TipoAtividade: { required },
      Id_Projeto: { required }
    }
  },
  computed: {
    tiposDespesaSelect() {
      var tiposDespesaSelect = [];
      this.tiposDespesa.forEach(td => {
        tiposDespesaSelect.push(this.createSelectModel(td.Descricao, td.Id));
      });

      return tiposDespesaSelect;
    },
    tiposAtividadeSelect() {
      var tiposAtividadeSelect = [];
      this.tiposAtividade.forEach(ta => {
        tiposAtividadeSelect.push(this.createSelectModel(ta.Descricao, ta.Id));
      });

      return tiposAtividadeSelect;
    },
    projetosSelect() {
      var projetosSelect = [];
      this.projetos.forEach(p => {
        projetosSelect.push(this.createSelectModel(p.ClienteProjeto, p.Id));
      });

      return projetosSelect;
    }
  },
  methods: {
    createSelectModel(label, value) {
      return { label: label, value: value };
    },
    clickItem() {
      this.$emit("clickItem", this.atividadeReal);
    },
    salvar() {},
    fechaModal() {
      this.open = false;
      Object.assign(this.atividadeNova,this.atividadeLimpa)
    },
    getInfos() {
      Loading.show();
      let token = LocalStorage.get.item("accessToken");
      if (!token) window.location = "/login";
      let config = {
        headers: {
          Authorization: "bearer " + token,
          "content-type": "application/json"
        }
      };

      axios
        .get(
          "http://localhost:53084/api/atividades_real/novaAtividade/infos",
          config
        )
        .then(response => {
          let infos = response.data;
          this.projetos = infos.Projetos;
          this.tiposAtividade = infos.TiposAtividade;
          this.tiposDespesa = infos.TiposDespesa;
          this.valorKm = infos.ValorKm;
          Loading.hide();
        })
        .catch(error => {
          Loading.hide();
          this.$q.notify({
            type: "negative",
            message:
              "Não foi possivel carregar as informações necessárias " + error
          });
        });
    }
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YY");
      }
    }
  },
  created: function() {

    Object.assign(this.atividadeLimpa,this.atividadeNova)
    this.$root.$on("abriModalNovaAtividade", () => {
      Object.assign(this.atividadeNova,this.atividadeLimpa)
      this.open = true;
      this.getInfos();

    });
    //this.getInfos();
  }
};
</script>

<style>
</style>
