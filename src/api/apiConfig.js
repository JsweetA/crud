import { useAppStore } from '@/store/app/app';

export const baseUrl = 'http://192.168.1.8:8848';
export const mockUrl = 'http://localhost';

export const getBaseUrl = () => {
  return baseUrl;
};

export default { baseUrl, getBaseUrl };
