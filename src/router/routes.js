
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/atividades') },
      { path: '/atividades/edit', component: () => import('pages/edit') }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
