<template>
    <q-page>
      <q-layout>
         <q-page-container>
        <q-tabs color="primary" inverted>
          <q-tab default slot="title" name="atividade" icon="message" label="Atividades"/>
          <q-tab slot="title" name="despesas" icon="clock" label="Despesas"/>
          <q-tab-pane name="atividade">
                <q-select v-model="select" :options="projetos" stack-label="Projeto"/>
                <q-select v-model="select" :options="projetos" stack-label="Tipo Atividade"/>
                <q-datetime format="dd/mm/yyyy" v-model="model" type="date" @change="val =>{model = val}" stack-label="Data"/>
                <q-datetime format24h v-model="model" type="time" @change="val =>{model = val}" stack-label="Hora Inicio"/>
                <q-datetime format24h v-model="model" type="time" @change="val =>{model = val}" stack-label="HoraFim"/>
                <q-input  clearable v-model="tempoImprodutivo" stack-label="Tempo Improdutivo" type="number" placeholder="Tempo Improdutivo"/>
                <q-input  clearable v-model="comentarios" stack-label="Comentarios" type="text" placeholder="Comentarios"/>
                <q-input  clearable v-model="chamadosJira" stack-label="ChamadosJira" type="text" placeholder="ChamadosJira"/>
          </q-tab-pane>
          <q-tab-pane name="despesas">Teste 2</q-tab-pane>
        </q-tabs>
        </q-page-container>
        
          <q-layout-footer >
            <q-toolbar>
              <q-btn flat right round align-right icon="save"/>
              <q-btn flat right round align-right icon="cancel"/>
            </q-toolbar>
        
          </q-layout-footer>
       </q-layout>
   </q-page>
</template>

<script>
export default {
  data() {
    return {
      projetos: [],
      tipoAtividades: [],
      tempoImprodutivo: 0,
      comentarios: "",
      chamadosJira: "",
      descricaoAtividades: "",
      despesas: []
    };
  }
  // name: 'PageName',
};
</script>

<style lang"stylus">
.docs-tab-pane
  .q-tab-pane
  display
  flex
  align-items
  center
  justify-content
  center
  height
  65px;
</style>
