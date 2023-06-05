<template>
  <div id="tags-view-container" class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedTags"
        ref="refTag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <span>{{ generateTitle(tag.title) }}</span>
        <Close v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"></Close>
      </router-link>
    </div>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
    </ul>
  </div>
</template>

<script setup>
import path from 'path-browserify';
import { Close } from '@element-plus/icons-vue';
import useI18n from '@/hooks/useI18n';
import { useAppStore } from '@/store/app/app';
import { useTagsViewStore } from '@/store/app/tagsView';
import { usePermissionStore } from '@/store/app/permission';

const { generateTitle } = useI18n();

const $route = useRoute();
const $router = useRouter();

const state = reactive({
  visible: false,
  top: 0,
  left: 0,
  selectedTag: {},
  affixTags: [],
});
const tagsViewStore = useTagsViewStore();

const visitedTags = computed(() => tagsViewStore.tags);
const permissionStore = usePermissionStore();
const routes = computed(() => permissionStore.routes);

const filterAffixTags = (routin, basePath = '/') => {
  let tags = [];
  routin.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      });
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path);
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags];
      }
    }
  });
  return tags;
};
const addTags = () => {
  const { name } = $route;
  if (name) {
    tagsViewStore.addTag($route);
  }
  return false;
};
const closeMenu = () => {
  state.visible = false;
};
const initTags = () => {
  const affixTags = (state.affixTags = filterAffixTags(routes.value));
  for (const tag of affixTags) {
    if (tag.name) {
      tagsViewStore.addTag(tag);
    }
  }
};

watch(
  () => $route.path,
  () => {
    addTags();
  },
);
watch(
  () => state.visible,
  (value) => {
    if (value) {
      document.body.addEventListener('click', closeMenu);
    } else {
      document.body.removeEventListener('click', closeMenu);
    }
  },
);

watch(
  () => state.visible,
  (value) => {
    if (value) {
      document.body.addEventListener('click', closeMenu);
    } else {
      document.body.removeEventListener('click', closeMenu);
    }
  },
);

onMounted(() => {
  initTags();
  addTags();
});

const isActive = (route) => route.path === $route.path;
const isAffix = (tag) => tag.meta && tag.meta.affix;


const appStore = useAppStore();
const toLastView = (tags, view) => {
  const latestView = tags?.value?.slice(-1)[0];
  if (latestView) {
    $router.push(latestView.fullPath);
  } else if (view.name === 'Dashboard') {
    $router.replace({ path: `/redirect${view.fullPath}` });
  } else {
    $router.push('/');
  }
};
const closeSelectedTag = (view) => {
  tagsViewStore.deleteTag(view);
  if (isActive(view)) {
    toLastView(visitedTags, view);
  }
  appStore.deleteCachedView(view.name);
};

const { proxy } = getCurrentInstance();
const openMenu = (tag, e) => {
  const menuMinWidth = 105;
  const offsetLeft = proxy.$el.getBoundingClientRect().left; // container margin left
  const { offsetWidth } = proxy.$el; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const left = e.clientX - offsetLeft + 15;

  if (left > maxLeft) {
    state.left = maxLeft;
  } else {
    state.left = left;
  }
  state.top = e.clientY;
  state.visible = true;
  state.selectedTag = tag;
};

const { visible, top, left, selectedTag } = toRefs(state);
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: $tagViewHeight;
  width: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px 0 --color-border, 0 0 3px 0 --color-border;
  background-color: var(--color-bg-2);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 24px;
      line-height: 24px;
      color: var(--color-text-1);
      background-color: var(--color-fill-2);
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 3px;

      &:first-of-type {
        margin-left: 10px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        color: rgb(var(--link-6));
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
.tags-view-wrapper {
  .tags-view-item {
    border-radius: 1px;

    .el-icon-close {
      border-radius: 6px;
      width: 12px;
      height: 12px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      vertical-align: -2px;
      margin-left: 5px;

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
