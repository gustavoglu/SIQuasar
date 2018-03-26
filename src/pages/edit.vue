<template>
    <q-page padding>
        <q-select v-model="select" :options="projetos" float-label="Projeto"/>
        <q-select v-model="select" :options="projetos" float-label="Tipo Atividade"/>
        <q-datetime format="dd/mm/yyyy" v-model="model" type="date" @change="val =>{model = val}" float-label="Data"/>
        <q-datetime format24h v-model="model" type="time" @change="val =>{model = val}" float-label="Hora Inicio"/>
        <q-datetime format24h v-model="model" type="time" @change="val =>{model = val}" float-label="HoraFim"/>
        <q-input  clearable v-model="tempoImprodutivo" stack-label="Tempo Improdutivo" type="number" placeholder="Tempo Improdutivo"/>
        <q-input  clearable v-model="comentarios" stack-label="Comentarios" type="text" placeholder="Comentarios"/>
        <q-input  clearable v-model="chamadosJira" stack-label="ChamadosJira" type="text" placeholder="ChamadosJira"/>
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
      descricaoAtividades: ""
    };
  }
  // name: 'PageName',
};
</script>

<style>

</style>
