import { createRouter, createWebHistory } from 'vue-router'

import IMEILookup from '../components/IMEILookup.vue'
import UserInfo from '../components/UserInfo.vue'
import AddNew from '@/components/AddNew.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'IMEILookup',
      component: IMEILookup
    },
    {
      path: '/user/:imei',
      name: 'UserInfo',
      component: UserInfo
    },
    {
      path: '/add-new',
      name: 'AddNew',
      component: AddNew
    }
  ]
})

export default router
