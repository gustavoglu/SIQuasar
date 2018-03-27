
export default [
  {
    path: '/atividades',
    component: () => import('layouts/default'),
    children: [
      { path: '/atividades', component: () => import('pages/atividades/list') },
      { path: '/atividades/edit', component: () => import('pages/atividades/edit') }
    ]
  },
  {
    path: "/login",
    component: ()=> import('pages/login/login')
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
