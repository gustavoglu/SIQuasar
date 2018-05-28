<template>
  <div>
    <q-modal v-model="open" maximized>
      <q-layout view="lHh Lpr lFf">
        <q-toolbar color="secondary">
           <q-toolbar-title>Editar Atividade</q-toolbar-title>
           <q-btn flat icon="close" @click.native="fechaModal"></q-btn>
         </q-toolbar>
        
        <q-tabs color="secondary"  align="justify" v-model="selectedTab">
          
          <q-tab default slot="title" name="atividade" icon="play_arrow" >Atividade</q-tab>
          <q-tab slot="title" name="despesas"  icon="monetization_on" >Despesas</q-tab>
          
          <q-tab-pane name="atividade">
            <q-layout>
              <div class="row">
                <q-select @blur="$v.atividade.selectProjeto.$touch" :error="$v.atividade.selectProjeto.$error"  class="q-pa-sm col" v-model="atividade.selectProjeto" :options="atividade.projetos" :select="atividade.selectProjeto" stack-label="Projeto"/>
                <q-select @blur="$v.atividade.selectTipoAtividade.$touch" :error="$v.atividade.selectTipoAtividade.$error"  class="q-pa-sm col" v-model="atividade.selectTipoAtividade" :options="atividade.tipoAtividades" :select="atividade.selectTipoAtividade" stack-label="Tipo Atividade"/>
              </div>

              <q-datetime class="q-pa-sm" v-model="atividade.data" format="DD/MM/YYYY" type="date" @change="val =>{model = val}" stack-label="Data"/>

              <div class="row">
                <q-datetime @blur="$v.atividade.horaIni.$touch" :error="$v.atividade.horaIni.$error"  class="q-pa-sm col" v-model="atividade.horaIni" format24h  type="time" @change="val =>{model = val}" stack-label="Hora Inicio"/>
                <q-datetime @blur="$v.atividade.horaFim.$touch" :error="$v.atividade.horaFim.$error"   class="q-pa-sm col" v-model="atividade.horaFim" format24h type="time" @change="val =>{model = val}" stack-label="HoraFim"/>
                <q-input  class="q-pa-sm" clearable v-model="atividade.tempoImprodutivo" stack-label="Almoço(min)" type="number" placeholder="Almoço"/>
              </div>

              <q-input  class="q-pa-sm" clearable v-model="atividade.comentarios" stack-label="Comentarios" type="textarea" placeholder="Comentarios"/>
              <q-input  class="q-pa-sm" clearable v-model="atividade.chamadosJira" stack-label="ChamadosJira" type="textarea" placeholder="ChamadosJira"/>
              <q-input  @blur="$v.atividade.descricaoAtividades.$touch"  :error="$v.atividade.descricaoAtividades.$error" class="q-pa-sm" clearable v-model="atividade.descricaoAtividades"  stack-label="Desc. Atividades" type="textarea" placeholder="Desc. Atividades"/>
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

              <q-list  v-if="despesas || despesas.length > 0" separator no-border>
                <div v-for="despesa in despesas ">
                  <despesaItem :despesa="despesa" :tipoDespesas="tipoDespesas" :valorKm="atividade.valorKm" 
                  @atualizaDespesa="atualizaDespesa($event)"  
                  @excluiDespesa="excluiDespesa($event)"/>
                </div>
              </q-list>

              <despesaModal :despesa="novaDespesa" :tiposDespesa="tipoDespesas" :valorKm="atividade.valorKm" 
              @atualizaDespesa="atualizaDespesa($event)" 
              @addNovaDespesa="addNovaDespesaSalva($event)" />
           
            </q-layout>
    
          </q-tab-pane>
          
        </q-tabs>

        <q-layout-footer>
          <q-toolbar color="secondary">
            <q-toolbar-title></q-toolbar-title>
              <q-btn flat label="Cancelar" @click.native="fechaModal"/>
              <q-btn flat label="Salvar" @click.native="salvar"/>
          </q-toolbar>
        </q-layout-footer>
      
       </q-layout>
    </q-modal>

  </div>
</template>

<script>
import axios from "axios";
import { LocalStorage, date, Loading } from "quasar";
import despesaItem from "components/despesas/itemDespesa";
import { required, email } from "vuelidate/lib/validators";
import despesaModal from "components/despesas/modals/modalDespesa";

export default {
  data() {
    return {
      name: "Editar Atividade",
      open: false,
      selectedTab: "atividade",
      despesas: [],
      tipoDespesas: [],
      atividade: {
        Id: null,
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
        id_Colaborador: "",
        valorKm: 0
      },
      novaDespesa: {
        Id: "",
        Comentarios: "",
        Valor: 0,
        NaoReembolsar: false,
        Km: 0,
        UseiMeuCarro: true,
        Id_TipoDespesa: "",
        Id_Projeto: "",
        Id_Atividade: "",
        Id_Colaborador: ""
      }
    };
  },
  validations: {
    atividade: {
      data: { required },
      horaIni: { required },
      horaFim: { required },
      descricaoAtividades: { required },
      selectProjeto: { required },
      selectTipoAtividade: { required }
    }
  },
  methods: {
    fechaModal() {
      this.open = false;
      this.selectedTab = "atividade";
    },
    addNovaDespesa() {
      if (this.atividade.Id) {
        this.novaDespesa.Id_Projeto = this.atividade.selectProjeto;
        this.novaDespesa.Id_Atividade = this.atividade.Id;
        this.novaDespesa.Id_Colaborador = this.atividade.id_Colaborador;
      }
      this.$root.$emit("abriModalDespesa", this.novaDespesa);
    },
    addNovaDespesaSalva(despesa) {
      this.despesas.push(despesa);
    },
    salvar() {
      this.$v.atividade.$touch();

      if (this.$v.atividade.$error) {
        this.$q.notify({
          message: "Existem campos obrigatórios não preenchidos",
          type: "negative"
        });
        return;
      }

      this.atualizaAtividade();
    },
    atualizaAtividade() {
      let atividade = {
        Id: this.atividade.Id,
        Data: this.atividade.data,
        HoraInicio: date.formatDate(this.atividade.horaIni, "HH:mm:ss"),
        HoraFim: date.formatDate(this.atividade.horaFim, "HH:mm:ss"),
        TempoImprodutivo: this.atividade.tempoImprodutivo,
        Comentarios: this.atividade.comentarios,
        ChamadosJira: this.atividade.chamadosJira,
        Id_Projeto: this.atividade.selectProjeto,
        Id_Colaborador: this.atividade.id_Colaborador,
        Id_TipoAtividade: this.atividade.selectTipoAtividade,
        DescAtividades: this.atividade.descricaoAtividades
      };

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
        .put("http://si.accist.com.br/api/atividades_real/", atividade, config)
        .then(response => {
          this.$emit("atividadeAtualizada", response.data);
          Loading.hide();
          this.open = false;
          this.$q.notify({ type: "positive", message: "Atividade Atualizada" });
        })
        .catch(error => {
          Loading.hide();
          this.$q.notify({
            type: "negative",
            message: "Algo deu errado ao tentar Atualizar a Atividade " + error
          });
        });
    },
    atualizaDespesa(despesa) {
      this.despesas.forEach(d => {
        if (d.Id == despesa.Id) d = despesa;
      });
    },
    excluiDespesa(despesa) {
      let despesaParaExcluir = {};
      this.despesas.forEach(d => {
        if (d.Id == despesa.Id) despesaParaExcluir = d;
      });

      let index = this.despesas.indexOf(despesaParaExcluir);
      if (index >= 0) this.despesas.splice(index, 1);
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
      this.atividade.projetos = this.createProjetosSelect(
        atividadeModel.Projetos
      );
      this.atividade.Id = atv.Id;
      this.tipoDespesas = atividadeModel.TipoDespesas;
      this.atividade.parametroKm = atividadeModel.Colaborador_Parametro_Km;
      this.atividade.selectTipoAtividade = atv.Id_TipoAtividade;
      this.atividade.selectProjeto = atv.Id_Projeto;
      this.atividade.data = atv.Data;
      this.atividade.horaIni = date.formatDate(
        atv.HoraInicio,
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      );
      this.atividade.horaFim = date.formatDate(
        atv.HoraFim,
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      );
      this.despesas = atividadeModel.Despesas;
      this.atividade.tempoImprodutivo = atv.TempoImprodutivo;
      this.atividade.comentarios = atv.Comentarios;
      this.atividade.chamadosJira = atv.ChamadosJira;
      this.atividade.descricaoAtividades = atv.DescAtividades;
      this.atividade.valorKm = atividadeModel.Colaborador_Parametro_Km;
      this.atividade.id_Colaborador = atv.Id_Colaborador;

      this.$v.atividade.$touch();
    },
    getAtividade(id) {
      Loading.show();
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
        .get("http://si.accist.com.br/api/atividades_real/" + id, config)
        .then(function(response) {
          let dataResponse = response.data;
          let atv = dataResponse.Atividade_Real;

          self.setAtividade(dataResponse);

          Loading.hide();
        })
        .catch(function(error) {
          self.$q.notify({
            type: "negative",
            message: "Algo deu errado ao tentar carregar a Atividade " + error
          });
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
    despesaItem,
    despesaModal
  },
  mounted: function() {},
  created: function() {
    this.$root.$on("abriModalEditAtividade", id => {
      if (!id) return;
      this.open = true;
      this.getAtividade(id);
    });
  }
};
</script>

<style>
</style>
