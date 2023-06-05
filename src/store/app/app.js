import { defineStore } from 'pinia';
import defaultSettings from '@/settings';

if (!defaultSettings?.showTop) document.getElementsByTagName('body')[0].style.setProperty('--size-title-height', '0px');

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: { opened: true },
    settings: defaultSettings,
    cachedViews: [],
  }),
  actions: {
    getSettings(data) {
      this.$patch((state) => {
        state.settings = { ...state.settings, ...data };
      });
    },
    setCachedViews(data) {
      this.$patch((state) => {
        state.cachedViews = [...state.cachedViews, ...data];
      });
    },
    toggleSideBar() {
      this.$patch((state) => {
        state.sidebar.opened = !state.sidebar.opened;
      });
    },
    addCachedView(view) {
      this.$patch((state) => {
        if (state.cachedViews.includes(view)) return;
        state.cachedViews.push(view);
      });
    },
    deleteCachedView(view) {
      this.$patch((state) => {
        const index = state.cachedViews.indexOf(view);
        index > -1 && state.cachedViews.splice(index, 1);
      });
    },
    resetCachedView() {
      this.$patch((state) => {
        state.cachedViews = [];
      });
    },
    changeTheme(theme) {
      document.body.removeAttribute('arco-theme');
      this.$patch((state) => {
        state.settings = { 
          ...state.settings,
          theme,
        };
      });
      document.body.setAttribute('arco-theme', theme);
    },
  }
});
