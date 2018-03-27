<template>
  <q-page padding>
    <h4>Atividades Realizadas</h4>
  <div>
     <q-select  
      toggle
      v-model="select" 
      :options="Periodos"
      :selected = "PeriodoAtual" 
     />
 </div>
 <div>
   <q-table 
   :data="tableDataCreate(this.Atividades)" 
   :columns="columns" 
   row-key="name"  
   selection="single"
   columnsPicker="true">
   </q-table>
 </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { LocalStorage } from "quasar";

export default {
  data() {
    return {
      config: {
        // title: 'Produtos',
        columnPicker: true,
        selection: "single",
        rowHeight: "50px"
      },
      columns: [
        {
          name: "data",
          required: true,
          label: "Data",
          align: "left",
          field: "data",
          sortable: true
        },
        {
          name: "clienteProjeto",
          required: true,
          label: "Cliente/Projeto",
          align: "left",
          field: "clienteProjeto",
          sortable: true
        },
        {
          name: "horaIni",
          required: true,
          label: "Hora Inicio",
          align: "left",
          field: "horaIni",
          sortable: true
        }
      ],

      PeriodoAtual: "",
      Periodos: [],
      Atividades: [],
      Totais: {
        TotalDespesas: 0,
        HorasProdutivas: 0,
        HorasImprodutivasd: 0
      }
    };
  },
  methods: {
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
    getAtividades() {
      let self = this;
      let uri = "http://si.accist.com.br/api/Atividades_Real";
      let accessToken = LocalStorage.get.item("accessToken");

      if (!accessToken) {
        window.location = '/login'
      };

      let config = {
        headers: {
          Authorization: "bearer " + accessToken,
          "Content-Type": "application/json"
        }
      };

      axios
        .get(uri, config)
        .then(function(response) {
          let dataResponse = response.data;
          self.Atividades = dataResponse.Atividades;
          self.PeriodoAtual = dataResponse.PeriodoAtual;
          self.Periodos = self.createPeriodos(dataResponse.Periodos);
          self.Totais = dataResponse.Totais;
        })
        .catch(function(errors) {
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
      alert(JSON.stringify(item));
    }
  },
  mounted: function() {
    let self = this;
    self.getAtividades();
  }
};
</script>

<style>

</style>
