import { createRouter, createWebHistory } from 'vue-router'

import IMEILookup from '../views/IMEILookup.vue'
import UserInfo from '../views/UserInfo.vue'
import AddNew from '@/views/AddNew.vue'
import AllUsers from '@/views/AllUsers.vue'

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
    },
    {
      path: '/all-users',
      name: 'AllUsers',
      component: AllUsers
    }
  ]
})

export default router
