<template>
  <q-page padding>
    <q-select v-model="select" :options="projetos" float-label="Projeto"/>
    <q-select v-model="select" :options="projetos" float-label="Tipo Atividade"/>
    <q-datetime format="dd/mm/yyyy" v-model="model" type="date" @change="val =>{model = val}" float-label="Data"/>
    <q-datetime format24h v-model="model" type="time" @change="val =>{model = val}" float-label="Hora Inicio"/>
    <q-datetime format24h v-model="model" type="time" @change="val =>{model = val}" float-label="HoraFim"/>
   <q-field
  count
  icon="account_box"
  helper="Some helper here"
  :label-width="3"
>
  <q-input float-label="Float Label" v-model="model" />
</q-field>
      
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      projetos: [],
      tipoAtividades: []
    };
  }
  // name: 'PageName',
};
</script>

<style>

</style>
