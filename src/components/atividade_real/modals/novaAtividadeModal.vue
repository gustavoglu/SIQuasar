<template>
  <div>
    <q-modal v-model="open" maximized>
       <q-layout view="lHh Lpr lFf">
         <q-toolbar color="secondary">
           <q-toolbar-title>Nova Atividade</q-toolbar-title>
           <q-btn flat icon="close" @click.native="fechaModal"></q-btn>
         </q-toolbar>
        
        <q-tabs v-model="selectedTab" color="secondary" align="justify" >
          
          <q-tab default slot="title" name="atividade" icon="play_arrow" >Atividade</q-tab>
          <q-tab slot="title" name="despesas"  icon="monetization_on" >Despesas</q-tab>
          
          <q-tab-pane name="atividade">
            <q-layout>
            
              <div class="row">
                <q-select :error="$v.atividadeNova.Id_Projeto.$error"  class="q-pa-sm col" v-model="atividadeNova.Id_Projeto" :options="projetosSelect" :select="atividadeNova.Id_Projeto" float-label="Projeto"/>
                <q-select :error="$v.atividadeNova.Id_TipoAtividade.$error"  class="q-pa-sm col" v-model="atividadeNova.Id_TipoAtividade" :options="tiposAtividadeSelect" :select="atividadeNova.Id_TipoAtividade" float-label="Tipo Atividade"/>
              </div>

              <q-datetime :error="$v.atividadeNova.Data.$error"  class="q-pa-sm" v-model="atividadeNova.Data" format="DD/MM/YYYY" type="date" @change="val =>{model = val}" stack-label="Data"/>

              <div class="row">
                <q-datetime :error="$v.atividadeNova.HoraInicio.$error"  class="q-pa-sm col" v-model="atividadeNova.HoraInicio" format24h  type="time" @change="val =>{model = val}" stack-label="Hora Inicio"/>
                <q-datetime :error="$v.atividadeNova.HoraFim.$error"   class="q-pa-sm col" v-model="atividadeNova.HoraFim" format24h type="time" @change="val =>{model = val}" stack-label="HoraFim"/>
              <q-input class="q-pa-sm col" clearable v-model="atividadeNova.TempoImprodutivo" stack-label="Almoço(min)" type="number" placeholder="Almoço(min)"/>
              </div>

              <q-input  class="q-pa-sm" clearable v-model="atividadeNova.Comentarios" stack-label="Comentarios" type="textarea" placeholder="Comentarios"/>
              <q-input  class="q-pa-sm" clearable v-model="atividadeNova.ChamadosJira" stack-label="ChamadosJira" type="textarea" placeholder="ChamadosJira"/>
              <q-input  :error="$v.atividadeNova.DescAtividades.$error" class="q-pa-sm" clearable v-model="atividadeNova.DescAtividades"  stack-label="Desc. Atividades" type="textarea" placeholder="Desc. Atividades"/>

            </q-layout>
          </q-tab-pane>
          
          <q-tab-pane name="despesas">
               
       
            <q-layout>
              <q-page-sticky position="bottom-right" :offset="[30, 60]">
                <q-btn fab color="secondary" icon="add" class="animate-pop" @click.native="addNovaDespesa"/>  
              </q-page-sticky>
            
              <q-item class="fixed-center" v-if="!despesas || despesas.length == 0">
                <q-item-main sublabel="Nenhuma Despesa Aqui"/>
              </q-item>
              
              <q-list v-if="despesas || despesas.length > 0" separator no-border>
                <div v-for="despesa in despesas">
                  <itemDespesaOffline :despesa="despesa" :tipoDespesas="tiposDespesa" :valorKm="valorKm" 
                    @atualizaNovaDespesaOffline="atualizaNovaDespesaOffline($event)" 
                    @salvaNovaDespesaOffline="salvaNovaDespesaOffline($event)"
                    @excluiDespesaOffline="excluiDespesaOffline($event)" /> 
                </div>
              </q-list>

              <modalDespesaOffline :tiposDespesa="tiposDespesa" :valorKm="valorKm" 
                @atualizaNovaDespesaOffline="atualizaNovaDespesaOffline($event)" 
                @salvaNovaDespesaOffline="salvaNovaDespesaOffline($event)" 
                @excluiDespesaOffline="excluiDespesaOffline($event)" />
           
            </q-layout>
    
          </q-tab-pane>
          
        </q-tabs>

        <q-layout-footer>
          <q-toolbar color="secondary">
            <q-toolbar-title></q-toolbar-title>
              <q-btn class="right" flat label="Cancelar" @click.native="fechaModal"/>
              <q-btn class="right" flat label="Salvar" @click.native="salvar"/>
          </q-toolbar>
        </q-layout-footer>
      
       </q-layout>
    </q-modal>

  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { required, email } from "vuelidate/lib/validators";
import { date, LocalStorage, Loading } from "quasar";
import modalDespesaOffline from "components/despesas/modals/modalDespesaOffline";
import itemDespesaOffline from "components/despesas/itemDespesaOffline";
export default {
  data() {
    return {
      selectedTab: "atividade",
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
  components: {
    modalDespesaOffline,
    itemDespesaOffline
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
    excluiDespesaOffline(despesa) {
      if (despesa) {
        let despesaExcluida = {};
        this.despesas.forEach(d => {
          if (d.Id == despesa.Id) despesaExcluida = d;
        });

        let index = this.despesas.indexOf(despesaExcluida);
        this.despesas.splice(index, 1);
      }
    },
    atualizaNovaDespesaOffline(despesa) {
      let despesaParaAtualizar = {};
      this.despesas.forEach(d => {
        if (d.Id == despesa.Id) Object.assign(d, despesa);
      });
    },
    salvaNovaDespesaOffline(despesa) {
      let despesaNovaObj = {};
      if (despesa) {
        Object.assign(despesaNovaObj, despesa);
        this.despesas.push(despesaNovaObj);
      }
    },
    validar() {
      this.$v.atividadeNova.$touch();
      if (this.$v.atividadeNova.$error) {
        this.$q.notify({
          message: "Existem campos obrigatórios não preenchidos",
          type: "negative"
        });
        return false;
      }
      return true;
    },
    addNovaDespesa() {
      this.$root.$emit("abriModalDespesaOffline");
    },
    createSelectModel(label, value) {
      return { label: label, value: value };
    },
    clickItem() {
      this.$emit("clickItem", this.atividadeReal);
    },
    salvar() {
      if (!this.validar()) return;

      let atividadeForm = {
       Atividade_Real :{
       Id: this.atividadeNova.Id,
        Data: this.atividadeNova.Data,
        HoraInicio: date.formatDate(this.atividadeNova.HoraInicio, "HH:mm:ss"),
        HoraFim: date.formatDate(this.atividadeNova.HoraFim, "HH:mm:ss"),
        TempoImprodutivo: this.atividadeNova.TempoImprodutivo,
        Comentarios: this.atividadeNova.Comentarios,
        ChamadosJira: this.atividadeNova.ChamadosJira,
        Id_Projeto: this.atividadeNova.Id_Projeto,
        Id_Colaborador: this.atividadeNova.Id_Colaborador,
        Id_TipoAtividade: this.atividadeNova.Id_TipoAtividade,
        DescAtividades: this.atividadeNova.DescricaoAtividades,
       },
        Despesas: this.despesas
      };
      //alert(atividadeForm.Atividade_Real.Data)
      //return
      let token = LocalStorage.get.item("accessToken");
      if (!token) window.location = "/login";
      let config = {
        headers: {
          Authorization: "bearer " + token,
          "content-type": "application/json"
        }
      };

      Loading.show();

      axios
        .post("http://localhost:53084/api/Atividades_Real/", atividadeForm, config)
        .then(response => {
          this.$emit("atividadeInserida", response.data);
          this.open = false;
          this.$q.notify({ type: "positive", message: "Atividade Inserida" });
        })
        .catch(error => {
          Loading.hide();
          this.$q.notify({
            type: "negative",
            message: "Algo deu errado ao tentar Inserir a Atividade " + error
          });
        });
    },
    fechaModal() {
      this.open = false;
      Object.assign(this.atividadeNova, this.atividadeLimpa);
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
          "http://si.accist.com.br/api/atividades_real/novaAtividade/infos",
          config
        )
        .then(response => {
          let infos = response.data;
          this.projetos = infos.Projetos;
          this.tiposAtividade = infos.TiposAtividade;
          this.tiposDespesa = infos.TiposDespesa;
          this.valorKm = infos.ValorKm;
          this.$v.atividadeNova.$touch();
          Loading.hide();
        })
        .catch(error => {
          Loading.hide();
          this.open = false;
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
    Object.assign(this.atividadeLimpa, this.atividadeNova);
    this.$root.$on("abriModalNovaAtividade", () => {
      Object.assign(this.atividadeNova, this.atividadeLimpa);
      this.selectedTab = "atividade";
      this.open = true;
      this.getInfos();
      this.despesas = [];
    });
  }
};
</script>

<style>
</style>
