import { useAppStore } from '@/store/app/app';

export const baseUrl = 'http://localhost:1234';
export const mockUrl = 'http://localhost';

export const getBaseUrl = () => {
  const appStore = useAppStore();
  const apiHost = localStorage.getItem('apiHost');
  const isProduct = appStore.settings.isProduct; // 如果是生产版，不允许修改api
  return apiHost && !isProduct ? `${apiHost}` : baseUrl;
};

export default { baseUrl, getBaseUrl };
