import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '../setup-mock';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'number|2-3': /[0-9]/,
      'name|4-8': /[A-Z]/,
      'contentType|1': ['img', 'horizontalVideo', 'verticalVideo'],
      'count|2-3': /[0-9]/,
      'status|1': ['online', 'offline'],
      'filterType|1': ['artificial', 'rules'],
      'createdTime': Random.datetime(),
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/list/policy'), (params) => {
      const url = params.url.split('?');
      const { current = 1, pageSize = 10 } = qs.parse(url[1]);
      const p = current;
      const ps = pageSize;
      return successResponseWrap({
        list: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});
