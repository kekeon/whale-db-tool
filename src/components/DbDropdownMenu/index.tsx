import { Dropdown, Menu } from 'antd'
import { MenuItemProps } from 'antd/lib/menu/MenuItem'
import React from 'react'

export interface MenuItem extends MenuItemProps {
  idx?: number | string
}

export interface Props {
  list: MenuItem[]
  onClick?: (data: MenuItem) => void
}
type PropsExtra = Props
const DbDropdownMenu: React.FC<PropsExtra> = (props) => {
  const menu = (
    <Menu>
      {props.list.map((item, index) => (
        <Menu.Item
          key={index}
          onClick={() => {
            props.onClick?.(item)
          }}
        >
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  )
  return <Dropdown overlay={menu}>{props.children}</Dropdown>
}
export default DbDropdownMenu
