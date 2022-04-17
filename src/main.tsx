import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { routes } from './routers/index'
import { Spin } from 'antd'

ReactDOM.render(
  <BrowserRouter>
    <React.Suspense fallback={<Spin />}>{renderRoutes(routes)}</React.Suspense>
  </BrowserRouter>,
  document.getElementById('root'),
)
