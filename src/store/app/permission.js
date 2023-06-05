import { defineStore } from 'pinia';
import { constantRoutes } from '@/router';
import settings from '@/settings';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [...constantRoutes],
    addRoutes: [],
  }),
});
