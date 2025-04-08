import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/updatePassword',
    component: () => import('@/views/login/updatepassword'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/frontpage',
    children: [{
      path: 'frontpage',
      name: '首页',
      component: () => import('@/views/frontpage/index'),
      meta: { title: '首页', icon: 'el-icon-chat-line-round' },
      hidden: true,
    },{
      path: 'ask',
      name: '对话',
      component: () => import('@/views/frontpage/ask'),
      meta: { title: '对话', icon: 'el-icon-chat-line-round' },
      hidden: true,
    }]
  },
  {
    path: '/setting',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/setting/index'),
        name: '设置',
        meta: { title: '设置', icon: 'el-icon-setting' },
        hidden: true,
      },
    ],
  },
  {
    path: '/history',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/history/index'),
        name: '历史记录',
        meta: { title: '历史记录', icon: 'el-icon-time' },
        hidden: true,
      },
    ],
  },
  {
    path: '/knowledgebase',
    component: Layout,
    hidden: true,
    children: [
    {
      path: 'knowledgebase',
      component: () => import('@/views/docinfo/dirlist'),
      name: '知识库管理',
      meta: { title: '知识库管理', icon: 'el-icon-reading' },
    },{
      path: 'knowledgebase/:id',
      component: () => import('@/views/docinfo/doclist'),
      name: '文档管理',
      meta: { title: '文档管理', icon: 'documentation'},
      hidden: true,
    },
  ],
  },
  {
    path: '/frontpage',
    component: Layout,
    children: [
      {
        path: '',
        component: null,
        name: '首页',
        meta: { title: '首页', icon: 'el-icon-house' },
      },
    ],
  },
  {
    path: '/knowledge',
    component: Layout,
    meta: { title: '知识点', icon: 'el-icon-document' ,roles: ['intermediate'] },
    children: [
      {
        path: '',
        component: () => import('@/views/note/index'),
        name: '知识点',
        meta: { title: '知识点', icon: 'el-icon-document' },
      },
    ],
  },
  {
    path: '/note',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/note/index'),
        name: '笔记',
        meta: { title: '笔记', icon: 'el-icon-edit-outline' },
      },
    ],
  },
  {
    path: '/material',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/ppt/material'),
        name: '素材库',
        meta: { title: '素材库', icon: 'el-icon-potato-strips' },
      },
    ],
  },
  {
    path: '/articles',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/ppt/pptList'),
        name: '成品库',
        meta: { title: '成品库', icon: 'el-icon-film' },
      },
    ],
  },{
    path: '/ppt',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/ppt/gen'),
        name: '课件生成',
        meta: { title: '课件生成' },
        hidden: true,
      }
    ],
  },{
    path: '/imagegen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/image/index'),
        name: '图片生成',
        meta: { title: '图片生成' },
        hidden: true,
      }
    ],
  },{
    path: '/dochandler',
    component: () => import('@/views/docinfo/dochandler'),
    hidden: true,
  },
  {
    path: "/staffsdesign/:id",
    component: () => import("@/views/staffs/design"),
    hidden: true,
  },
  {
    path: "/staffsuse/:id",
    component: () => import("@/views/staffs/use"),
    hidden: true,
  },
  {
    path: "/reportorstaffsuse/:id",
    component: () => import("@/views/staffs/reportorUse"),
    hidden: true,
  },
  {
    path: "/staffs/report",
    component: () => import("@/views/staffs/report"),
    hidden: true,
  },
  // {
  //   path: "/staffs/pptList",
  //   component: () => import("@/views/staffs/pptList"),
  //   hidden: true,
  // },
  {
    path: "/s/report/:id",
    component: () => import("@/views/staffs/shareReport"),
    hidden: true,
  },
  {
    path: "/s/:code",
    component: () => import("@/views/staffs/shareUse"),
    hidden: true,
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
// export const asyncRoutes = [
//   {
//     path: '/develop',
//     component: Layout,
//     redirect: '/develop/agent',
//     // alwaysShow: true,
//     name: '中级开发者',
//     meta: { title: '中级开发者', icon: 'el-icon-school',roles: ['intermediate'] },
//     children: [{
//       path: 'agent',
//       name: '创建能力',
//       component: () => import('@/views/agent/index'),
//       meta: { title: '创建能力', icon: 'component',roles: ['intermediate']}
//     },{
//       path: 'flow',
//       name: '创建工作流',
//       component: () => import('@/views/flow/index'),
//       meta: { title: '创建工作流', icon: 'el-icon-s-help',roles: ['intermediate']}
//     },{
//       path: 'template',
//       component: () => import('@/views/template/index'),
//       name: '定制模板',
//       meta: { title: '定制模板', icon: 'el-icon-notebook-2',roles: ['intermediate']},
//     },{
//       path: 'prompt',
//       component: () => import("@/views/prompt/list"),
//       name: '提示词管理',
//       meta: { title: '提示词管理', icon: 'edit',roles: ['intermediate'] }
//     },{
//       path: 'datasource',
//       component: () => import('@/views/docinfo/dataSourelist'),
//       name: '数据处理',
//       meta: { title: '数据处理', icon: 'skill',roles: ['intermediate'] },
//     }],
//   },{
//     path: '/senior',
//     component: Layout,
//     // alwaysShow: true,
//     name: '高级开发者',
//     meta: { title: '高级开发者', icon: 'el-icon-set-up',roles: ['senior']},
//     children: [{
//       path: 'plugin',
//       name: '开发插件',
//       component: () => import('@/views/plugin/index'),
//       meta: { title: '开发插件', icon: 'el-icon-set-up',roles: ['senior']}
//     },{
//       path: 'graph',
//       component: () => import('@/views/graph/index'),
//       name: '知识图谱',
//       meta: { title: '知识图谱', icon: 'el-icon-share',roles: ['senior']},
//     },{
//       path: 'api',
//       component: () => import('@/views/api/index'),
//       name: 'YaoAPI',
//       meta: { title: 'YaoAPI', icon: 'el-icon-key',roles: ['senior']},
//     }],
//   },
//   {
//     path: "/plugin/:id",
//     component: () => import("@/views/plugin/detail"),
//     hidden: true,
//   },
//   {
//     path: "/flow/:id",
//     component: () => import("@/views/flow/detail"),
//     hidden: true,
//   },
//   {
//     path: "/agent/:id",
//     component: () => import("@/views/agent/detail"),
//     hidden: true,
//   },
//   {
//     path: "/template/:id",
//     component: () => import("@/views/template/design"),
//     hidden: true,
//   },{
//     path: "/prompt/:id",
//     component: () => import("@/views/prompt/view"),
//     hidden: true,
//   },
// ]
const createRouter = () => new Router({
  // mode: 'history', // require service support,.concat(asyncRoutes)
  scrollBehavior: () => ({ y: 0 }),
  // routes: constantRoutes.concat(asyncRoutes)
  routes: constantRoutes
})
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
