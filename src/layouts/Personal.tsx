import { AUTH_TOKEN } from '@/constant/js/storageKey'
import storage from '@/utils/storage'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Menu, Dropdown } from 'antd'
import React from 'react'
import { useHistory } from 'react-router'

const Personal: React.FC = () => {
  const history = useHistory()
  const handleLogout = () => {
    storage().removeLocal(AUTH_TOKEN)
    history.replace('/login')
  }

  return (
    <div>
      <Dropdown
        arrow={true}
        placement="bottomCenter"
        overlay={
          <Menu>
            <Menu.Item onClick={handleLogout} style={{ width: '80px', textAlign: 'center' }}>
              退出
            </Menu.Item>
          </Menu>
        }
      >
        <Avatar size="small" icon={<UserOutlined />} />
      </Dropdown>
    </div>
  )
}
export default Personal
