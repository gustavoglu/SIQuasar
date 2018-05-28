<template>
  <q-page padding>
  <div>
    <q-select toggle v-model="select"  :options="Periodos" :selected = "PeriodoAtual"   @input="inputPeriodo" float-label="Periodo"/>
 </div>
 <div class="row q-ma-sm">
   <q-item class="col">
    <q-item-tile  color="secondary" icon="monetization_on"/>
     <q-item-tile color="secondary"> {{'R$ '+ Totais.TotalDespesas.toFixed(2)}}</q-item-tile>
   </q-item>
     <q-item class="col">
      <q-item-tile color="secondary" icon="play_arrow"/>
     <q-item-tile color="secondary"> {{Totais.HorasProdutivas.toFixed(2) + ' Horas'}} </q-item-tile>
   </q-item>
     <q-item class="col">
      <q-item-tile  color="secondary" icon="pause"/>
     <q-item-tile  color="secondary" > {{Totais.HorasImprodutivasd.toFixed(2) + ' Horas'}}</q-item-tile>
   </q-item>
 </div>
 <div>

   <q-list no-border>
     <div v-for="atividade in Atividades">
        <itemAtividadeReal :atividadeReal="atividade"/>
     </div>
   </q-list>
   <editAtividadeModal />

 </div>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">

      <q-btn fab color="secondary" icon="add" class="animate-pop" @click.native="novaAtividade()"/>

    </q-page-sticky>
    <novaAtividadeModal @atividadeInserida="getAtividades(select)"/>
  </q-page>
</template>

<script>
import axios from "axios";
import { LocalStorage, Loading } from "quasar";
import itemAtividadeReal from "components/atividade_real/itemAtividadeReal";
import qs from "qs";
import novaAtividadeModal from "components/atividade_real/modals/novaAtividadeModal";
import editAtividadeModal from "components/atividade_real/modals/editAtividadeModal";

export default {
  data() {
    return {
      PeriodoAtual: "",
      Periodos: [],
      Atividades: [],
      Totais: {
        TotalDespesas: 0,
        HorasProdutivas: 0,
        HorasImprodutivasd: 0
      },
      select: ""
    };
  },
  methods: {
    novaAtividade() {
      this.$root.$emit("abriModalNovaAtividade");
    },
    rowClick(row) {
      window.location = "atividades/Edit";
    },
    tableDataCreate(arrayAtividades) {
      let atividadesTable = [];
      for (let i = 0; i < arrayAtividades.length; i++) {
        const atividade = arrayAtividades[i];
        atividadesTable.push({
          data: atividade.Data,
          clienteProjeto: atividade.ClienteProjeto,
          horaIni: atividade.HoraInicio
        });
      }
      return atividadesTable;
    },
    getAtividades(periodo) {
      let self = this;
      let uri = !periodo
        ? "http://si.accist.com.br/api/Atividades_Real"
        : "http://si.accist.com.br/api/Atividades_Real/periodo/" +
          periodo.replace("/", "-");
      let accessToken = LocalStorage.get.item("accessToken");

      if (!accessToken) self.$router.push("/login");

      let config = {
        headers: {
          Authorization: "bearer " + accessToken,
          "Content-Type": "application/json"
        }
      };

      Loading.show();

      axios
        .get(uri, config)
        .then(function(response) {
          let dataResponse = response.data;
          self.Atividades = [];
          dataResponse.Atividades.forEach(a => {
            self.Atividades.push(a);
          });
          self.Atividades.sort((a, b) => {

            let date1 = new Date(a.Data.replace('00:00:00', a.HoraInicio));
            let date2 = new Date(b.Data.replace('00:00:00', b.HoraInicio));
            if (date1 > date2) return -1;

            if (date1 < date2) return 1;

            return 0;
          });
          self.PeriodoAtual = dataResponse.PeriodoAtual;
          self.Periodos = self.createPeriodos(dataResponse.Periodos);
          self.Totais = dataResponse.Totais;
          if (!periodo) self.select = self.PeriodoAtual;
          Loading.hide();
        })
        .catch(function(errors) {
          Loading.hide();
          self.$q.notify({
            type: "negative",
            message: "Algo deu errado ao tentar carregar as Atividades " + error
          });

          return;
        });
    },
    createPeriodos(periodos) {
      let periodosArray = [];
      periodos.forEach(e => {
        periodosArray.push({ label: e, description: e, value: e });
      });
      return periodosArray;
    },
    tableClick(item) {
      window.location = "/Edit";
    },
    atualizaLista() {},
    inputPeriodo(periodoSelecionado) {
      let self = this;
      if (periodoSelecionado.value == self.select) return;
      let periodo = self.select;
      if (self.select) self.getAtividades(periodo);
    }
  },
  mounted: function() {
    let self = this;
    self.getAtividades();
  },
  computed: {},
  components: {
    itemAtividadeReal,
    novaAtividadeModal,
    editAtividadeModal
  },
  created: function() {
    this.$root.$on("atualizarAtividades", () => {
      this.getAtividades(this.select);
    });
    this.$root.$emit("titulo", "Atividades Realizadas");
  }
};
</script>

<style>
</style>
