import { createRouter, createWebHashHistory } from 'vue-router'

import Chat from '@/pages/Chat'

const routes = [
  { path: '/', component: Chat },
  { path: '/home', component: () => import('@/pages/Home') },
  { path: '/setting', component: () => import('@/pages/Setting') },
  { path: '/preinstall', component: () => import('@/pages/Preinstall') },
  { path: '/create-session', component: () => import('@/pages/CreateSession') },
  { path: '/give-reward', component: () => import('@/pages/GiveAReward') },
  { path: '/help', component: () => import('@/pages/Help') },
  { path: '/about', component: () => import('@/pages/About') }
]

export default createRouter({ history: createWebHashHistory(), routes })