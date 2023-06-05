<template>
  <el-icon class="icon">
    <component :is="item" />
  </el-icon>
</template>

<script setup>
const props = defineProps({
  item: {
    require: true,
    default: 'Fold',
    type: String,
  },
});
const { item } = props;
</script>

<style scoped lang="scss">
.icon {
  width: 1em;
  height: 1em;
  margin-left: -2px;
  font-size: 20px !important;
  text-align: left !important;
}
</style>
