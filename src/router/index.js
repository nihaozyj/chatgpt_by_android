import { createRouter, createWebHashHistory } from 'vue-router'

import Chat from '@/pages/Chat'

const routes = [
  { path: '/', component: Chat }
]

export default createRouter({ history: createWebHashHistory(), routes })