import { lazy } from 'react'
import { RouteConfig } from 'react-router-config'

export const routes: RouteConfig[] = [
  {
    component: lazy(() => import('@/App')),
    routes: [
      {
        path: '/login',
        exact: true,
        component: lazy(() => import('@/pages')),
      },
      {
        path: '/main',
        // exact: true,
        component: lazy(() => import('@/layouts/BasicLayout')),
        routes: [
          {
            path: '/main/overview',
            exact: true,
            component: lazy(() => import('@/pages/overview')),
          },
          {
            path: '/main/mysql',
            exact: true,
            component: lazy(() => import('@/pages/mysql')),
          },
          {
            path: '/main/redis',
            exact: true,
            component: lazy(() => import('@/pages/redis')),
          },
        ],
      },
    ],
  },
]
