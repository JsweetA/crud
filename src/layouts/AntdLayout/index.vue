<template>
  <a-layout class="over-layout" :class="{ mobile: appStore.hideMenu, ...classObj }">
    <div v-if="settings.showMenu" class="menu-container">
      <Menu />
    </div>
    <div v-if="settings.showTop" class="top-container">
      <Top :show_top_title="false" :show_top_menu="false" />
    </div>
    <div class="main-container">
      <Tags v-show="settings.showTags" />
      <Main />
    </div>
    <RightPanel v-if="!appStore.settings.isProduct">
      <Setting />
    </RightPanel>
  </a-layout>
</template>

<script setup name="LeftMenu">
import { Main, Tags, Top } from '../modules';
import Menu from './CMenu';
import { useAppStore } from '@/store/app/app';
import Setting from '@/layouts/components/Setting/index.vue';
import RightPanel from '@/layouts/components/RightPanel/index.vue';

const appStore = useAppStore();
const opened = computed(() => appStore.sidebar.opened);

const settings = computed(() => appStore.settings);
const classObj = computed(() => ({
  closeSidebar: !opened.value,
  hideSidebar: !settings.value.showMenu,
}));
</script>

<style lang="scss" scoped>
.over-layout {
  width: 100%;
  height: 100%;
  background-color: var(--color-fill-2);
}
.top-container {
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-2);
  width: 100%;
  height: $titleHeight;
}
.main-container {
  position: fixed;
  top: $titleHeight;
  left: $sideBarWidth;
  height: calc(100% - $titleHeight) !important;
  transition: margin-left 0.28s cubic-bezier(0.34, 0.69, 0.1, 1);
  width: calc(100% - $sideBarWidth);
  background-color: var(--color-bg-2);
}
.menu-container {
  // transition: width 0.28s cubic-bezier(0.34, 0.69, 0.1, 1);
  background: var(--color-bg-2);
  width: $sideBarWidth;
  height: 100%;
  position: relative;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  box-shadow: 0 2px 5px 0 var(--color-border);
  border-right: 1px solid var(--color-border);
}
.closeSidebar {
  .menu-container {
    width: $closeBarWidth !important;
  }
  .main-container {
    width: calc(100% - $closeBarWidth);
    left: $closeBarWidth;
  }
}
.hideSidebar {
  .menu-container {
    width: 0 !important;
  }
  .main-container {
    margin-left: 0;
  }
}
</style>
