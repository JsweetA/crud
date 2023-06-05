<template>
  <component class="icon" :is="item"></component>
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
  font-size: 20px;
  margin: 0 !important;
}
</style>
