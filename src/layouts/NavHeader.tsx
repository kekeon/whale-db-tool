import { UserOutlined } from '@ant-design/icons'
import { Avatar, Layout, Menu } from 'antd'
import React from 'react'
import { Link, useHistory, withRouter } from 'react-router-dom'
import Personal from './Personal'

import NavHeaderStyles from './style/NavHeader.module.less'

const Header = Layout.Header

const NavHeader = () => {
  const history = useHistory()
  return (
    <Header className={NavHeaderStyles['nav-header']}>
      <div className="left-wrap">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" selectedKeys={[history.location.pathname]} style={{ lineHeight: '40px' }}>
          <Menu.Item key="/main/overview">
            <Link to="/main/overview">DB概览</Link>
          </Menu.Item>
          <Menu.Item key="/main/mysql">
            <Link to="/main/mysql">MySQL</Link>
          </Menu.Item>
          <Menu.Item key="/main/redis">
            <Link to="/main/redis">Redis</Link>
          </Menu.Item>
        </Menu>
      </div>
      <div className="right-wrap">
        <Personal />
      </div>
    </Header>
  )
}

export default NavHeader
