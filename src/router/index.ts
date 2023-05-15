import { createRouter, createWebHashHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    // component: HomeView,
    redirect: '/loading',
  },
  {
    path: '/loading',
    name: 'loading',
    component: () => import('@/views/AsyncLoading.vue'),
  },
  {
    path: '/three',
    name: 'three',
    component: () => import('@/views/ThreeScene.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
