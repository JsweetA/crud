import fly from 'axios';
import { initDB, } from '@/modules/log';

let store = null;

const init = async () => {
  store = await initDB();
};

init();

fly.interceptors.response.use(
	async (response) => {
    return response;
	},
	async (error) => {
    await store.insertData({
      type: 'api',
      content: error?.message,
      stack: error?.stack,
      extra: '',
      date: new Date().getTime(),
    });
	}
);

export function queryDataChainGrowth(data) {
  return fly.post('/api/data-chain-growth', data);
}

export function queryPopularAuthor() {
  return fly.get('/api/popular-author/list');
}

export function queryContentPublish() {
  return fly.get('/api/content-publish');
}

export function queryContentPeriodAnalysis() {
  return fly.post('/api/content-period-analysis');
}

export function queryPublicOpinionAnalysis(data) {
  return fly.post(
    '/api/public-opinion-analysis',
    data
  );
}

export function queryDataOverview() {
  return fly.post('/api/data-overview');
}
