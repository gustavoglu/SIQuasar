<template>
    <q-page>
      <q-layout>
        
        <q-tabs color="secondary"  align="justify" >
          <q-tab default slot="title" name="atividade" icon="play_arrow" >Atividade</q-tab>
          <q-tab slot="title" name="despesas"  icon="monetization_on" >Despesas</q-tab>
          
          <q-tab-pane name="atividade">
            <div class="row">
            <q-select class="q-pa-sm col" v-model="selectProjeto" :options="projetos" :select="selectProjeto" stack-label="Projeto"/>
            <q-select class="q-pa-sm col" v-model="selectTipoAtividade" :options="tipoAtividades" :select="selectTipoAtividade" stack-label="Tipo Atividade"/>
            </div>
            <q-datetime class="q-pa-sm" v-model="data" format="DD/MM/YYYY" type="date" @change="val =>{model = val}" stack-label="Data"/>
            <div class="row">
              <q-datetime class="q-pa-sm col" v-model="horaIni" format24h  type="time" @change="val =>{model = val}" stack-label="Hora Inicio"/>
              <q-datetime class="q-pa-sm col" v-model="horaFim" format24h type="time" @change="val =>{model = val}" stack-label="HoraFim"/>
            </div>
            <q-input  class="q-pa-sm" clearable v-model="tempoImprodutivo" stack-label="Tempo Improdutivo(min)" type="number" placeholder="Tempo Improdutivo"/>
            <q-input  class="q-pa-sm" clearable v-model="comentarios" stack-label="Comentarios" type="textarea" placeholder="Comentarios"/>
            <q-input  class="q-pa-sm" clearable v-model="chamadosJira" stack-label="ChamadosJira" type="textarea" placeholder="ChamadosJira"/>
            <q-input  class="q-pa-sm" clearable v-model="descricaoAtividades"  stack-label="Desc. Atividades" type="textarea" placeholder="Desc. Atividades"/>
          </q-tab-pane>
          
          <q-tab-pane name="despesas">
            <q-list separator no-border>
              <div v-for="despesa in despesas ">
                <despesaItem :despesa="despesa" :tipoDespesas="tipoDespesas" :valorKm="valorKm" />
              </div>
            </q-list>
          </q-tab-pane>
        
        </q-tabs>
       </q-layout>
   </q-page>
</template>

<script>
import axios from "axios";
import { LocalStorage, date, Loading } from "quasar";
import despesaItem from "components/despesas/itemDespesa";

export default {
  data() {
    return {
      name: "Editar Atividade",
      projetos: [],
      tipoAtividades: [],
      tipoDespesas : [],
      data: "",
      horaIni: "",
      horaFim: "",
      tempoImprodutivo: 0,
      comentarios: "",
      chamadosJira: "",
      descricaoAtividades: "",
      parametroKm: 0,
      despesas: [],
      selectProjeto: "",
      selectTipoAtividade: "",
      despesas: [],
      valorKm : 0
    };
  },
  methods: {
    setAtividade(atividadeModel) {
      let atv = atividadeModel.Atividade_Real;

      let horaIni =
        "" + atv.Data.toString().replace("00:00:00", "") + atv.HoraInicio;
      let horaFim =
        "" + atv.Data.toString().replace("00:00:00", "") + atv.HoraFim;

      this.tipoAtividades = this.createTipoAtividadesSelect(
        atividadeModel.TipoAtividades
      );
      this.projetos = this.createProjetosSelect(atividadeModel.Projetos);
      this.tipoDespesas = atividadeModel.TipoDespesas;
      this.parametroKm = atividadeModel.Colaborador_Parametro_Km;
      this.selectTipoAtividade = atv.Id_TipoAtividade;
      this.selectProjeto = atv.Id_Projeto;
      this.data = atv.Data;
      this.horaIni = date.formatDate(horaIni, "YYYY-MM-DDTHH:mm:ss.SSSZ");
      this.horaFim = date.formatDate(horaFim, "YYYY-MM-DDTHH:mm:ss.SSSZ");
      this.despesas = atividadeModel.Despesas;
      this.tempoImprodutivo = atv.TempoImprodutivo;
      this.comentarios = atv.Comentarios;
      this.chamadosJira = atv.ChamadosJira;
      this.descricaoAtividades = atv.DescAtividades;
      this.despesas = atividadeModel.Despesas;
      this.valorKm = atividadeModel.Colaborador_Parametro_Km
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
