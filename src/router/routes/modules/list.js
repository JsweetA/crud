import Layout from '@/layouts';

export const route = [
  {
    path: '/list',
    component: Layout,
    redirect: '/card',
    meta: {
      title: 'list',
      remixIcon: 'ri-list-unordered',
    },
    children: [
      {
        path: 'table',
        // 与组件名对应才能缓存
        name: 'search_table',
        cachePage: false,
        component: () => import('@/pages/list/table/index.vue'),
        meta: { title: 'table', arcoIcon: 'IconSelectAll', },
      },
    ],
  },
];

export default route;
