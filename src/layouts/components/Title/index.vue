<template>
  <div class="container">
    <img
      class="logo"
      :style="props.collapsed ? 'width: 70%;' : ''"
      src="/logo.png"
    />
    <div class="name" v-if="!props.collapsed">
      {{settings.title}}
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app/app';
import { computed, } from 'vue';

const props = defineProps({
  collapsed: {
    default: false,
    type: Boolean,
  },
});


const appStore = useAppStore();
const settings = computed(() => appStore.settings);
</script>

<style scoped lang="scss">
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  @include center;
  width: 100%;
  height: 100%;
  background-color: rgb(var(--color-menu-bg));

  .logo {
    width: 20%;
    margin: 12px;
  }

  .name {
    @include center;
    font-weight: 700;
    font-size: 20px;
    color: rgb(var(--color-menu-dark-text));
  }
}
</style>
