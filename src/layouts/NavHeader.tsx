import { UserOutlined } from '@ant-design/icons'
import { Avatar, Layout, Menu } from 'antd'
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import NavHeaderStyles from './style/NavHeader.module.less'

const Header = Layout.Header

class NavHeader extends React.Component<any> {
  componentDidMount() {
    console.log('NavHeader', this.props)
  }

  toPage(prop: any) {
    console.log(prop)
  }

  render() {
    return (
      <Header className={NavHeaderStyles['nav-header']}>
        <div className="left-wrap">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={this.props.location.pathname}
            style={{ lineHeight: '40px' }}
            onClick={this.toPage}
          >
            <Menu.Item key="/main/overview">
              <Link to="/main/overview">DB概览</Link>
            </Menu.Item>
            <Menu.Item key="/main/mysql">
              <Link to="/main/mysql">mysql</Link>
            </Menu.Item>
          </Menu>
        </div>
        <div className="right-wrap">
          <Avatar size="small" icon={<UserOutlined />} />
        </div>
      </Header>
    )
  }
}

export default withRouter(NavHeader)
