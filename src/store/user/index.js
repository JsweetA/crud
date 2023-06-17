import { defineStore } from 'pinia';
import { Login } from '@/services/login.js';
import _ from 'lodash';
import { setToken, removeToken,setAuthority, removeAuthority } from '@/utils/auth';

/**
 * @return {*}
 * @description: 登录
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    person: {
      username: '',
      age: '',
      avatar: '',
    },
    token: '',
    roles: ''
  }),
  actions: {
    setPerson (info,) {
      this.$patch((state) => {
        // 避免引用、此处应该复制
        Object.assign(state, _.cloneDeep({
          person: info,
        }));
      });
    },
    async login (params) {
      const res = await Login(params);
      this.setPerson(res?.data);
      setToken(res?.data?.token);
      setAuthority(res?.data?.authority);

      return res?.code === 200;
    },
    async logout() {
      return new Promise((resolve, reject) => {
        removeToken();
        removeAuthority();
        resolve(null);
      });
    },
  }
});