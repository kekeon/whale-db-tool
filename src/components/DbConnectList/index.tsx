import React, { useEffect, useState } from 'react'
import style from './index.module.less'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { mysqlList } from '@/service/mysql'
import { mysql } from '@/types'

interface Props {
  onDelete: (uuid: conmon.uuid) => void
  onAdd: () => void
  // onEdit: (item: conmon.cuid) => void
  onChange: (uuid: conmon.uuid) => void
}

type PropsExtra = Props

const DbConnectList: React.FC<PropsExtra> = (props) => {
  const [uuidIndex, setUuidIndex] = useState<conmon.uuid>('')
  const [list, setList] = useState<mysql.dbList[]>()
  useEffect(() => {
    initAction()
  }, [])

  const initAction = async () => {
    let res = await mysqlList()
    setList(res.data?.list)
  }

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
  }

  const handleChange = (uuid: conmon.uuid) => {
    setUuidIndex(uuid)
    props.onChange && props.onChange(uuid)
  }

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
                  className="ml5"
                  onClick={() => {
                    // props.onEdit(item.connection_uuid)
                  }}
                />
                <DeleteOutlined
                  className="ml5"
                  onClick={() => {
                    props.onDelete(item.connection_uuid)
                  }}
                />
              </span>
            </div>
          ))
        : null}
      <PlusOutlined className="ml10 cursor" onClick={props.onAdd} />
    </div>
  )
}
export default DbConnectList
