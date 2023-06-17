<template>
    <div class="main">
      <Card v-for="config of configs" 
      :key="config.lable" 
      :name="config.name" 
      :lable="config.lable"/>
    </div>
</template>

<script setup name="config">
import Card from './component/card.vue';

const configs = [
  {name:"department",lable:"部门"},
];


</script>

<style scoped>
.card-demo {
  flex:1;
  margin-left: 24px;
  transition-property: all;
}
.card-demo:hover {
  transform: translateY(-4px);
}
</style>