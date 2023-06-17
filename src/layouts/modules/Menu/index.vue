<template>
  <a-menu
    class="menu"
    :collapsed="!isCollapse"
    :mode="mode"
    :level-indent="34"
    :default-collapsed="true"
    v-model:selected-keys="activeMenu"
    :default-open-keys="openKeys"
    @onCollapse="toggleSideBar"
  >
    <menu-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
  </a-menu>
  <a-button v-if="mode === 'vertical'" class="btn" @click="toggleSideBar">
    <icon-menu-fold v-if="isCollapse" />
    <icon-menu-unfold v-else />
  </a-button>
</template>

<script setup>
import MenuItem from './MenuItem.vue';
import { useAppStore } from '@/store/app/app';
import { usePermissionStore } from '@/store/app/permission';
import router from '@/router';
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';
import { getAuthority } from '@/utils/auth';
import _ from 'lodash';

const props = defineProps({
  mode: {
    require: true,
    default: 'vertical',
    type: String,
  },
});
const authority = getAuthority();
const appStore = useAppStore();
const settings = computed(() => appStore.settings);
const route = useRoute();
const permissionStore = usePermissionStore();
const routes = ref();
const isCollapse = computed(() => appStore.sidebar.opened);
const now = useRoute();
const activeMenu = ref([now?.path]);
const openKeys = reactive([]);

if (now?.matched?.length > 0) {
  openKeys.push(now?.matched[0]?.path);
}

router.beforeEach((to, from, next) => {
  activeMenu.value = [to.path];
  next();
});

const toggleSideBar = () => {
  appStore.toggleSideBar();
};

onMounted(() => {
  let r = _.cloneDeep(permissionStore.routes);
  r = r.map((i) => {
    if (i?.isPages) {
      i.children = i.children.filter((e) => e.authority.includes(authority));
    }
    return i;
  });
  routes.value = {
    ...r,
  };
});
</script>

<style lang="scss" scoped>
.menu {
  height: 100%;
}

.btn {
  position: absolute;
  z-index: 999;
  bottom: 12px;
  right: 3px;
}
</style>
