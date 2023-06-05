import Layout from '@/layouts';

export const route = [
  {
    path: '/map',
    component: Layout,
    redirect: 'amap',
    meta: {
      title: 'map',
      remixIcon: 'ri-map-2-line',
    },
    children: [
      {
        path: 'amap',
        name: 'amap',
        component: () => import('@/pages/map/amap/index.vue'),
        meta: { title: 'amap', cachePage: true, remixIcon: 'ri-compass-line', },
      },
    ],
  },
];

export default route;
