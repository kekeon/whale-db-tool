import React, { useCallback, useEffect, useState } from 'react'
import style from './index.module.less'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { mysql } from '@/types'
import { Popconfirm } from 'antd'

interface Props {
  onDelete: (uuid: common.uuid) => void
  onAdd: () => void
  onEdit: (uuid: common.cuid) => void
  onChange: (uuid: common.uuid) => void
  list?: mysql.dbList[]
}

type PropsExtra = Props

const DbConnectList: React.FC<PropsExtra> = ({ list = [], ...props }) => {
  const [uuidIndex, setUuidIndex] = useState<common.uuid>('')

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
  }

  const handleChange = useCallback(
    (uuid: common.uuid) => {
      if (uuidIndex === uuid) {
        return
      }
      setUuidIndex(uuid)
      props?.onChange(uuid)
    },
    [uuidIndex],
  )

  return (
    <div className={style['db-connect-lsit']}>
      {list && list.length
        ? list.map((item, index: number) => (
            <div
              className={classNames('db-item-wrap', {
                ml10: index > 0,
                'db-item-active': uuidIndex === item.connection_uuid,
              })}
              key={item.connection_uuid}
              onClick={() => {
                handleChange(item.connection_uuid)
              }}
            >
              <span className="db-item">{item.connection_another_name}</span>
              <span className="db-edit-icon-wrap">
                <EditOutlined
                  className="ml5 icon_btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    const d: common.cuid = {
                      uuid: item.connection_uuid,
                      another_name: item.connection_another_name,
                      host: item.connection_host,
                      name: item.connection_account,
                      password: '',
                      port: Number(item.connection_port),
                    }
                    props?.onEdit(d)
                  }}
                />
                <Popconfirm
                  title="确认删除？"
                  okText="确认"
                  cancelText="取消"
                  onConfirm={(e) => {
                    e?.stopPropagation()
                    props?.onDelete(item.connection_uuid)
                  }}
                >
                  <DeleteOutlined onClick={(e) => e?.stopPropagation()} className="ml5 icon_btn" />
                </Popconfirm>
              </span>
            </div>
          ))
        : null}
      <PlusOutlined className="ml10 cursor icon_btn" onClick={props.onAdd} />
    </div>
  )
}
export default DbConnectList
