import Layout from '@/views/layout/Layout'

const sysRouter = {
  path: '/sys',
  component: Layout,
  redirect: 'sys',
  name: '系统管理',
  meta: { title: '系统管理', icon: 'dashboard', noCache: true },
  children: [
    {
      path: 'user',
      component: () => import('@/views/sys/User'),
      name: '用户管理',
      meta: { title: '用户管理', icon: 'dashboard', noCache: true }
    },
    {
      path: 'menu',
      component: () => import('@/views/sys/Menu'),
      name: '菜单管理',
      meta: { title: '菜单管理', icon: 'dashboard', noCache: true }
    }
  ]
}
export default sysRouter
