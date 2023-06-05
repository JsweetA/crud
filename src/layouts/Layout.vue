<template>
  <TopMenu v-if="layout === 'top'" />
  <LeftMenu v-if="layout === 'left'" />
  <AntdMenu v-if="layout === 'antd'" />
</template>

<script setup name="Layout">
import { useAppStore } from '@/store/app/app';
import LeftMenu from './LeftLayout/index.vue';
import TopMenu from './TopLayout/index.vue';
import AntdMenu from './AntdLayout/index.vue';

const appStore = useAppStore();
const layout = computed(() => {
  return appStore.settings.layout;
});
</script>

<style lang="scss" scoped>
</style>
