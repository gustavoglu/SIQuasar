<template>
    <q-page>
      <q-layout>
         <q-page-container>
        <q-tabs color="secondary" >
          <q-tab default slot="title" name="atividade" icon="message" label="Atividades"/>
          <q-tab slot="title" name="despesas" icon="clock" label="Despesas"/>
          <q-tab-pane name="atividade">
           
                <q-select class="q-pa-sm" v-model="selectProjeto" :options="projetos" :select="selectProjeto" stack-label="Projeto"/>
                <q-select class="q-pa-sm" v-model="selectTipoAtividade" :options="tipoAtividades" :select="selectTipoAtividade" stack-label="Tipo Atividade"/>
                <q-datetime class="q-pa-sm" v-model="data" format="DD/MM/YYYY" type="date" @change="val =>{model = val}" stack-label="Data"/>
                <q-datetime class="q-pa-sm" v-model="horaIni" format24h  type="time" @change="val =>{model = val}" stack-label="Hora Inicio"/>
                <q-datetime class="q-pa-sm" v-model="horaFim" format24h type="time" @change="val =>{model = val}" stack-label="HoraFim"/>
                <q-input  class="q-pa-sm" clearable v-model="tempoImprodutivo" stack-label="Tempo Improdutivo" type="number" placeholder="Tempo Improdutivo"/>
                <q-input  class="q-pa-sm" clearable v-model="comentarios" stack-label="Comentarios" type="text" placeholder="Comentarios"/>
                <q-input  class="q-pa-sm" clearable v-model="chamadosJira" stack-label="ChamadosJira" type="text" placeholder="ChamadosJira"/>
  
          </q-tab-pane>
          <q-tab-pane name="despesas">Teste 2</q-tab-pane>
        </q-tabs>
        </q-page-container>
        
      <div class="fixed-right">
                   <q-btn   flat right round align-right icon="save"/>
                   <q-btn  flat right round align-right icon="cancel"/>
              </div>

          <q-layout-footer >
            <q-toolbar color="secondary">
             
            </q-toolbar>
                  </q-layout-footer>
       </q-layout>
   </q-page>
</template>

<script>
import axios from "axios";
import { LocalStorage ,date} from "quasar";

export default {
  data() {
    return {
      name: 'Editar Atividade',
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
      despesas: [],
      selectProjeto: "",
      selectTipoAtividade: ""
    };
  },
  methods: {
    getAtividade(id) {
      id = "fdd66123-30e7-4b1b-849b-ad4371ffc185";
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
            "fdd66123-30e7-4b1b-849b-ad4371ffc185",
          config
        )
        .then(function(response) {
          let dataResponse = response.data
          let atv = dataResponse.Atividade_Real

          self.tipoAtividades = self.createTipoAtividadesSelect(dataResponse.TipoAtividades)
          self.projetos = self.createProjetosSelect(dataResponse.Projetos)
          self.tipoDespesas = dataResponse.TipoDespesas
          self.parametroKm = dataResponse.Colaborador_Parametro_Km
          self.selectTipoAtividade = atv.Id_TipoAtividade
          self.selectProjeto = atv.Id_Projeto
          self.data = atv.Data
          self.horaIni = date.formatDate (Date.now(),'YYYY-MM-DDTHH:mm:ss.SSSZ')
          self.horaFim = date.formatDate (Date.now(),'YYYY-MM-DDTHH:mm:ss.SSSZ')
          self.despesas = dataResponse.Despesas

        })
        .catch(function(error) {
          alert(error);
        });
    },

    createSelectModel(label, value) {
      return { label: label, value: value };
    },

    createProjetosSelect(projetos) {
      let self = this
      var projetosSelect = [];
      projetos.forEach(p => {
        projetosSelect.push(self.createSelectModel(p.ClienteProjeto, p.Id));
      });
      return projetosSelect;
    },

    createTipoAtividadesSelect(tipoAtividades) {
      let self = this
      var tipoAtividadesSelect = [];
      tipoAtividades.forEach(ta => {
        tipoAtividadesSelect.push(self.createSelectModel(ta.Descricao, ta.Id));
      });
      return tipoAtividadesSelect;
    }
  },
  mounted: function() {
    console.log(this)
    let self = this;
    self.getAtividade("teste");
  }
  // name: 'PageName',
};
</script>

<style>

</style>
