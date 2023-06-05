<template>
  <div class="content">
    <div class="title" v-if="settings.showTitle">
      <Title :collapsed="!isCollapse" />
    </div>
    <a-menu
      class="menu"
      :collapsed="!isCollapse"
      :mode="mode"
      :level-indent="34"
      :default-collapsed="true"
      :default-selected-keys="[activeMenu]"
      @onCollapse="toggleSideBar"
    >
      <menu-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
    </a-menu>
    <a-button v-if="mode === 'vertical'" class="btn" @click="toggleSideBar">
      <icon-menu-fold v-if="isCollapse" />
      <icon-menu-unfold v-else />
    </a-button>
  </div>
</template>

<script setup>
import MenuItem from './MenuItem.vue';
import { useAppStore } from '@/store/app/app';
import Title from '@/layouts/components/Title/index.vue'; 
import { usePermissionStore } from '@/store/app/permission';

const props = defineProps({
  mode: {
    require: true,
    default: 'vertical',
    type: String,
  },
});

const appStore = useAppStore();

const settings = computed(() => appStore.settings);

const route = useRoute();
const permissionStore = usePermissionStore();
const routes = computed(() => permissionStore.routes);
const isCollapse = computed(() => appStore.sidebar.opened);
let activeMenu = window.location.hash;
if (activeMenu) activeMenu = activeMenu.substring(1, activeMenu.length);
const toggleSideBar = () => {
  appStore.toggleSideBar();
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .menu {
    flex: 1;
    transition: none;
  }

  .btn {
    position: absolute;
    z-index: 999;
    bottom: 12px;
    right: 3px;
    background-color: rgba(var(--color-menu-bg), .1);
    color: rgb(var(--color-menu-dark-text));
  }
}
</style>
