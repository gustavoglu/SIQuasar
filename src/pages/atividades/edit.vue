<template>
    <q-page>
      <q-layout view="lHh Lpr lFf">
        
        <q-tabs color="secondary"  align="justify" >
          <q-tab default slot="title" name="atividade" icon="play_arrow" >Atividade</q-tab>
          <q-tab slot="title" name="despesas"  icon="monetization_on" >Despesas</q-tab>
          
          <q-tab-pane name="atividade">
           
            <div class="row">
              <q-select  @blur="$v.atividade.selectProjeto.$touch" :error="$v.atividade.selectProjeto.$error"  class="q-pa-sm col" v-model="atividade.selectProjeto" :options="atividade.projetos" :select="atividade.selectProjeto" stack-label="Projeto"/>
              <q-select @blur="$v.atividade.selectTipoAtividade.$touch" :error="$v.atividade.selectTipoAtividade.$error"  class="q-pa-sm col" v-model="atividade.selectTipoAtividade" :options="atividade.tipoAtividades" :select="atividade.selectTipoAtividade" stack-label="Tipo Atividade"/>
            </div>
           
            <q-datetime class="q-pa-sm" v-model="atividade.data" format="DD/MM/YYYY" type="date" @change="val =>{model = val}" stack-label="Data"/>
           
            <div class="row">
              <q-datetime @blur="$v.atividade.horaIni.$touch" :error="$v.atividade.horaIni.$error"  class="q-pa-sm col" v-model="atividade.horaIni" format24h  type="time" @change="val =>{model = val}" stack-label="Hora Inicio"/>
              <q-datetime @blur="$v.atividade.horaFim.$touch" :error="$v.atividade.horaFim.$error"   class="q-pa-sm col" v-model="atividade.horaFim" format24h type="time" @change="val =>{model = val}" stack-label="HoraFim"/>
            </div>
           
            <q-input  class="q-pa-sm" clearable v-model="atividade.tempoImprodutivo" stack-label="Tempo Improdutivo(min)" type="number" placeholder="Tempo Improdutivo"/>
            <q-input  class="q-pa-sm" clearable v-model="atividade.comentarios" stack-label="Comentarios" type="textarea" placeholder="Comentarios"/>
            <q-input   class="q-pa-sm" clearable v-model="atividade.chamadosJira" stack-label="ChamadosJira" type="textarea" placeholder="ChamadosJira"/>
            <q-input   @blur="$v.atividade.descricaoAtividades.$touch"  :error="$v.atividade.descricaoAtividades.$error" class="q-pa-sm" clearable v-model="atividade.descricaoAtividades"  stack-label="Desc. Atividades" type="textarea" placeholder="Desc. Atividades"/>
          </q-tab-pane>
          
          <q-tab-pane name="despesas">
            <q-list separator no-border>
              <div v-for="despesa in despesas ">
                <despesaItem :despesa="despesa" :tipoDespesas="ativiade.tipoDespesas" :valorKm="atividade.valorKm" />
              </div>
            </q-list>
          </q-tab-pane>
        
        </q-tabs>
        <q-layout-footer>
          <q-toolbar color="secondary">
            <q-btn  flat label="Salvar" @click.native="salvar"/>
          </q-toolbar>
        </q-layout-footer>
       </q-layout>
   </q-page>
</template>

<script>
import axios from "axios";
import { LocalStorage, date, Loading } from "quasar";
import despesaItem from "components/despesas/itemDespesa";
import {required,email} from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      name: "Editar Atividade",
     atividade:{
      projetos: [],
      tipoAtividades: [],
    
      data: "",
      horaIni: "",
      horaFim: "",
      tempoImprodutivo: 0,
      comentarios: "",
      chamadosJira: "",
      descricaoAtividades: "",
      parametroKm: 0,
     
      selectProjeto: "",
      selectTipoAtividade: "",
      valorKm : 0
     },
      despesas: [],
      tipoDespesas : [],
    };
  },
  validations:{
    atividade:{
      data: {required},
      horaIni: {required},
      horaFim: {required},
      descricaoAtividades: {required},
      selectProjeto: {required},
      selectTipoAtividade: {required},
    },
     
    
  },
  methods: {
       salvar () {
      this.$v.atividade.$touch()

      if (this.$v.atividade.$error) {
        this.$q.notify({ message : 'Existem campos obrigatórios não preenchidos', type : 'negative'})
        return
      }
       },
    setAtividade(atividadeModel) {
      let atv = atividadeModel.Atividade_Real;

      let horaIni =
        "" + atv.Data.toString().replace("00:00:00", "") + atv.HoraInicio;
      let horaFim =
        "" + atv.Data.toString().replace("00:00:00", "") + atv.HoraFim;

      this.atividade.tipoAtividades = this.createTipoAtividadesSelect(
        atividadeModel.TipoAtividades
      );
      this.atividade.projetos = this.createProjetosSelect(atividadeModel.Projetos);
      this.tipoDespesas = atividadeModel.TipoDespesas;
      this.atividade.parametroKm = atividadeModel.Colaborador_Parametro_Km;
      this.atividade.selectTipoAtividade = atv.Id_TipoAtividade;
      this.atividade.selectProjeto = atv.Id_Projeto;
      this.atividade.data = atv.Data;
      this.atividade.horaIni = date.formatDate(horaIni, "YYYY-MM-DDTHH:mm:ss.SSSZ");
      this.atividade.horaFim = date.formatDate(horaFim, "YYYY-MM-DDTHH:mm:ss.SSSZ");
      this.despesas = atividadeModel.Despesas;
      this.atividade.tempoImprodutivo = atv.TempoImprodutivo;
      this.atividade.comentarios = atv.Comentarios;
      this.atividade.chamadosJira = atv.ChamadosJira;
      this.atividade.descricaoAtividades = atv.DescAtividades;
      this.atividade.valorKm = atividadeModel.Colaborador_Parametro_Km
    },
    getAtividade(id) {
      Loading.show();

      id = "803b11d4-6314-4dcc-8cf5-0a2c2860bdd9";
      if (!id) return;

      let token = LocalStorage.get.item("accessToken");
      if (!token) window.location = "/login";
      let self = this;
      let config = {
        headers: {
          Authorization: "bearer " + token,
          "content-type": "application/json"
        }
      };

      axios
        .get(
          "http://si.accist.com.br/api/atividades_real/" +
            "803b11d4-6314-4dcc-8cf5-0a2c2860bdd9",
          config
        )
        .then(function(response) {
          let dataResponse = response.data;
          let atv = dataResponse.Atividade_Real;

          self.setAtividade(dataResponse);

          Loading.hide();
        })
        .catch(function(error) {
          alert(error);
          Loading.hide();
        });
    },

    createSelectModel(label, value) {
      return { label: label, value: value };
    },

    createProjetosSelect(projetos) {
      let self = this;
      var projetosSelect = [];
      projetos.forEach(p => {
        projetosSelect.push(self.createSelectModel(p.ClienteProjeto, p.Id));
      });
      return projetosSelect;
    },

    createTipoAtividadesSelect(tipoAtividades) {
      let self = this;
      var tipoAtividadesSelect = [];
      tipoAtividades.forEach(ta => {
        tipoAtividadesSelect.push(self.createSelectModel(ta.Descricao, ta.Id));
      });
      return tipoAtividadesSelect;
    }
  },
  components: {
    despesaItem
  },
  mounted: function() {
    this.getAtividade("teste");
  }

  // name: 'PageName',
};
</script>

<style>
</style>
