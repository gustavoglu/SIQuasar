<template>
  <div>
    <q-select toggle 
      v-model="select" 
      float-label="Periodo" 
      :options="Periodos" 
      select="PeriodoAtual" 
     />
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data() {
    return {};
  }
};
</script>

<style>

</style>
