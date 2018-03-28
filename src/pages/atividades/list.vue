<template>
  <q-page padding>
    <h4>Atividades Realizadas</h4>
  <div>
     <q-select  
      toggle
      v-model="select" 
      :options="Periodos"
      :selected = "PeriodoAtual" 
      @change="periodoChange"
      float-label = "Periodo"
     />
 </div>
 <div>
   <q-table 
   :data="tableDataCreate(this.Atividades)" 
   :columns="columns" 
   selection="single">
      <q-tr 
      slot="body" 
      slot-scope="props" 
      :props="props" 
      @click.native="rowClick(props.row)" 
      class="cursor-pointer">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
           {{ col.value }} 
        </q-td>
      </q-tr>
      
   </q-table>
 </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { LocalStorage } from "quasar";
import qs from 'qs'

export default {
  data() {
    return {
      serverPagination:{
        rowsNumber:20
      },
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
      },
      select:''
    };
  },
  methods: {
    rowClick(row){
      alert(qs.stringify(row))
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
      let uri = !periodo ? "http://si.accist.com.br/api/Atividades_Real":
                           "http://si.accist.com.br/api/Atividades_Real/periodo/" + periodo.replace('/','-');
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
          if(!periodo)
            self.select = self.PeriodoAtual
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
  },
  computed:{
    periodoChange(){
      let self = this;
      self.getAtividades(self.select)
    }
  }
};
</script>

<style>

</style>
