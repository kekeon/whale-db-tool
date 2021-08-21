import React, { useState } from 'react'
import { renderRoutes } from 'react-router-config'
import { RecoilRoot } from 'recoil'
import './common/css/index.less'

function App(props: any) {
  return <RecoilRoot>{renderRoutes(props.route.routes)}</RecoilRoot>
}

export default App
