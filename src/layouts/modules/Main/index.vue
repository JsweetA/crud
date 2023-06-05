<template>
  <div class="app-main" :class="{ 'show-tag-view': settings.showTags }">
    <router-view v-slot="{ Component }">
      <transition v-if="settings.openAnimation" name="fade-transform" mode="out-in">
        <div class="compo">
          <keep-alive :include="keepViews">
            <component :is="Component" :key="key" />
          </keep-alive>
        </div>
      </transition>
      <keep-alive v-else :include="keepViews">
        <component :is="Component" :key="key" />
      </keep-alive>
    </router-view>
  </div>
</template>
    
<script setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app/app';
import router from '@/router';
import { onMounted } from 'vue';

const appStore = useAppStore();

const { cachedViews } = storeToRefs(appStore);

const keepViews = ref('');

const route = useRoute();
const settings = computed(() => appStore.settings);

const key = computed(() => {
  return route.name;
});

watch(
  () => cachedViews.value,
  () => {
    keepViews.value = cachedViews.value;
  },
  { deep: true },
);

let arr = router.getRoutes().filter((e) => e?.meta?.cachePage);
arr = arr.map((e) => e?.name);
appStore.setCachedViews(arr);

router.beforeEach((to, from, next) => {
  if (to?.name && (to?.cachePage || to?.meta?.cachePage)) {
    appStore.addCachedView(to?.name);
  }
  next();
});
</script>

<style scoped lang="scss">
.app-main {
  padding: $appMainPadding;
  position: relative;
  overflow: auto;
  background-color: var(--color-fill-2);
  height: 100%;
  width: 100%;
}
.compo {
  width: 100%;
  height: 100%;
}
.show-tag-view {
  height: calc(100% - #{$tagViewHeight}) !important;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
