import Layout from '@/layouts';

export const route = [
  {
    path: '/three',
    component: Layout,
    redirect: 'three',
    meta: {
      title: 'three',
      remixIcon: 'ri-map-2-line',
    },
    children: [
      {
        path: 'cesium',
        name: 'cesium',
        component: () => import('@/pages/three/cesium/index.vue'),
        meta: { title: 'cesium', cachePage: true, remixIcon: 'ri-map-pin-line', },
      },
      {
        path: 'demo1',
        name: 'demo1',
        component: () => import('@/pages/three/demo1/index.vue'),
        meta: { title: 'demo1', cachePage: true, remixIcon: 'ri-pie-chart-2-line', },
      },
      {
        path: 'demo2',
        name: 'demo2',
        component: () => import('@/pages/three/demo2/index.vue'),
        meta: { title: 'demo2', cachePage: true, remixIcon: 'ri-compasses-line', },
      },
    ],
  },
];

export default route;
