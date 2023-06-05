import { defineStore } from 'pinia';
import setting from '@/settings';

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    tags: [],
  }),
  actions: {
    addTag(page) {
      this.$patch((state) => {
        if (state.tags.some((v) => {
          return v.path === page.path;
        })) return;
        if (state.tags.length >= setting.tagsViewNum) {
          state.tags.pop();
          state.tags.push({ ...page, title: page.meta.title || 'no-name' });
        } else {
          state.tags.push({ ...page, title: page.meta.title || 'no-name' });
        }
      });
    },
    deleteTag(page) {
      this.$patch((state) => {
        if (!state.tags.some((v) => v.path === page.path)) return;
        for (let i = 0; i < state.tags.length; i++) {
          if (state.tags[i]?.path === page?.path) {
            state.tags.splice(i, 1);
          }
        }
      });
    }
  },
});
