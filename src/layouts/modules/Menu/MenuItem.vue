<template>
  <template v-if="!item.hidden">
    <template v-if="showSidebarItem(item, item.children)">
      <Link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <a-menu-item
          :key="resolvePath(onlyOneChild.path)"
        >
          <template #icon>
            <item :meta="onlyOneChild.meta || item.meta" />
          </template>
          {{ generateTitle(onlyOneChild.meta?.title) }}
        </a-menu-item>
      </Link>
    </template>
    <a-sub-menu v-else
      :key="resolvePath(item.path)"
    >
      <template v-if="item.meta" #icon>
        <item :meta="item.meta" />
      </template>
      <template v-if="item.meta" #title>
        {{ generateTitle(item?.meta?.title) }}
      </template>
      <menu-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </a-sub-menu>
  </template>
</template>

<script setup>
/* 初始化参数比如引入组件，proxy,state等 */
import path from 'path-browserify';
import Link from './Link.vue';
import Item from './Item';
import { getAuthority } from '@/utils/auth';
import { isExternal } from '@/utils/validate';
// i18n
import useI18n from '@/hooks/useI18n';

const authority = getAuthority();
const props = defineProps({
  // 每一个router Item
  item: {
    type: Object,
    required: true,
  },
  // 用于判断是不是子Item,设置响应的样式
  isNest: {
    type: Boolean,
    default: false,
  },
  // 基础路径，用于拼接
  basePath: {
    type: String,
    default: '',
  },
});
const { generateTitle } = useI18n();
// 显示sidebarItem 的情况
const onlyOneChild = ref(null);
const showSidebarItem = (parent, children = []) => {
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    }
    // Temp set(will be used if only has one showing child)
    onlyOneChild.value = item;
    return true;
  });
  if (showingChildren.length === 1 && !parent?.alwaysShow) {
    return true;
  }
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noChildren: true };
    return true;
  }
  return false;
};
const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  return path.resolve(props.basePath, routePath);
};


</script>
