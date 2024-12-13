import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import PlayerSelection from '@/views/playerSelection.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: IndexView
  },
  {
    path: '/player-selection',
    name: 'playerSelection',
    component: PlayerSelection
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
