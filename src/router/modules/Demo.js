/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const demoRouter = {
  // 和sso配置的一级菜单路径一致
  path: '/teacherInfo',
  component: Layout,
  redirect: '/teacherInfo/masterTeacher',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'demo'
  },
  children: [
    {
      // 和sso配置的路径一致
      path: 'masterTeacher',
      component: () => import('@/views/Demo/index'),
      name: 'Demo',
      meta: {
        title: 'demo'
      }
    }
  ]
}
export default demoRouter
