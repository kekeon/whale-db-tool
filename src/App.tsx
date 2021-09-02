import React, { useEffect } from 'react'
import { renderRoutes } from 'react-router-config'
import { RecoilRoot } from 'recoil'
import { ConfigProvider } from 'antd'

import './common/css/index.less'
import './index.less'

function App(props: any) {
  return (
    <ConfigProvider>
      <RecoilRoot>{renderRoutes(props.route.routes)}</RecoilRoot>
    </ConfigProvider>
  )
}

export default App
