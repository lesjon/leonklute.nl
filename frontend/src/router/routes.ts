import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/resume',
    component: () => import('layouts/ResumeLayout.vue'),
    children: [{ path: '', component: () => import('pages/ResumePage.vue') },
    { path: 'experience', component: () => import('pages/ExperiencePage.vue') }],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
