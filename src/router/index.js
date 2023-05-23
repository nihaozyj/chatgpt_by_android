import { createRouter, createWebHashHistory } from 'vue-router'

import Chat from '@/pages/Chat'

const routes = [
  { path: '/', component: Chat },
  { path: '/home', component: () => import('@/pages/Home') },
  { path: '/setting', component: () => import('@/pages/Setting') }
]

export default createRouter({ history: createWebHashHistory(), routes })