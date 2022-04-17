import React from 'react'
import 'antd/dist/antd.css'
import { renderRoutes, RouteConfig } from 'react-router-config'

import styles from './style/index.module.less'
import { Layout, Spin } from 'antd'
import NavHeader from './NavHeader'
import { useRecoilValue } from 'recoil'
import { commonGlobalLoading } from '@/store/common'

const Content = Layout.Content

type MainProps = RouteConfig

const Main: React.FC<MainProps> = (props) => {
  const commonGlobalLoadingState = useRecoilValue(commonGlobalLoading)
  return (
    <Layout className={styles['main-page']}>
      <NavHeader />
      <Layout>
        <Spin wrapperClassName={styles['content-spin']} tip="loading..." spinning={commonGlobalLoadingState}>
          <Content className="content-wrap">{renderRoutes(props.route.routes)}</Content>
        </Spin>
      </Layout>
    </Layout>
  )
}

export default Main
