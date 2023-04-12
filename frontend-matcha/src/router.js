import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/home.vue';

const routes = [
    {
      path: '/',
      name: 'HomeView',
      component: HomePage
    },
    {
      path: '/chat',
      name: 'ChatView',
      component: () => import('./views/chat.vue')
    },
    {
      path: '/completeProfile',
      name: 'CompleteProfile',
      component: () => import('./views/completeProfile.vue')
    },
    {
      path: '/forget',
      name: 'ForgetView',
      component: () => import('./views/forget.vue')
    },
    {
      path: '/history',
      name: 'HistoryView',
      component: () => import('./views/history.vue')
    },
    {
      path: '/index',
      name: 'IndexView',
      component: () => import('./views/index.vue')
    },
    {
      path: '/match',
      name: 'MatchView',
      component: () => import('./views/match.vue')
    },
    {
      path: '/notif',
      name: 'NotifView',
      component: () => import('./views/notif.vue')
    },
    {
      path: '/profile',
      name: 'ProfileView',
      component: () => import('./views/profile.vue')
    },
    {
      path: '/setting',
      name: 'SettingView',
      component: () => import('./views/setting.vue')
    },
    {
      path: '/token',
      name: 'TokenComponent',
      component: () => import('./views/token.vue')
    }
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
