<template>
  <div class="container" id="3d">
  </div>
</template>

<script setup name="3d">
  import { onMounted } from 'vue';
  import { init3d } from './3d';

  onMounted(() => {
    init3d('3d');
  });
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
  }
</style>
