import { getToken } from '@/utils/auth';
import Fly from 'flyio/dist/npm/fly';
import { Notification } from '@arco-design/web-vue';
import { getBaseUrl } from '../apiConfig';
import router from '../../router';

const fly = new Fly();

export const request = ({ url, params, method = 'GET', headers = {}, describe = '', callback }) => {
  const baseUrl = getBaseUrl();
  const token = getToken();
  return new Promise((resolve, reject) => {
    fly
      .request(`${baseUrl}${url}`, params, {
        method,
        headers: {
          'content-type': 'application/json',
          accept: '*/*',
          "satoken":token,
          ...headers,
        },
      })
      .then((data) => {
        if(data?.data?.code === 401) {
          setTimeout(() => {
            router.push({
              name:'Login'
            });
          }, 2000);
          reject(data?.data?.msg);
        }
        if(data?.data?.code !== 200) reject(data?.data?.msg);
        
        resolve(data?.data);
      })
      .catch((e) => {
        console.log('error', e);
        Notification.error(`请求${describe}失败：${e?.message}`);
        if (callback) callback(e);
        reject(e);
      });
  }).catch((e) => {
    
    Notification.error(`${e}`);
  });
};

export default request;
