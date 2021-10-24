import React, { useEffect } from 'react'
import { renderRoutes } from 'react-router-config'
import { RecoilRoot } from 'recoil'
import { ConfigProvider } from 'antd'

import './common/css/index.less'
import './index.less'
import storage from './utils/storage'
import { AUTH_TOKEN } from './constant/js/storageKey'

function App(props: any) {
  useEffect(() => {
    init()
  }, [])

  const init = () => {
    const val = storage().getLocal<string>(AUTH_TOKEN, '')
    if (val) {
      props.history?.replace('main/overview')
    } else {
      props.history?.replace('/login')
    }
  }

  return (
    <ConfigProvider>
      <RecoilRoot>{renderRoutes(props.route.routes)}</RecoilRoot>
    </ConfigProvider>
  )
}

export default App
