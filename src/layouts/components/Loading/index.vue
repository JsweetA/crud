<template>
  <div class="loading">
    <img src="@/assets/png/loading.gif" class="loading-image"/>
  </div>
</template>

<script setup name="Loading">
</script>

<style lang="scss" scoped>
  .loading{
    display: flex;
    justify-content: center;

    .loading-image{
      width: 400px;
      margin-top: 10%;
    }
  }
</style>