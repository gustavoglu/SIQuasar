export default [{
    path: '/',
    component: () => import ('layouts/default'),
    children: [{
      path: '/',
      component: () => import ('pages/atividades/list')
    }, ]
  },

  {
    path: "/login",
    component: () =>
      import ('pages/login/login')
  },
  { // Always leave this as last one
    path: '*',
    component: () =>
      import ('pages/404')
  }
]
