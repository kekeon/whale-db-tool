import { RedisKeyType } from '@/types/redisType'
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import React, { useMemo } from 'react'
interface TableViewProps<T> {
  keyType: string
  dataSource: T[]
}

const TableView = <T extends {}>({ keyType, dataSource }: TableViewProps<T>) => {
  const columns = useMemo(() => {
    const idxCol = { dataIndex: 'idx', title: 'ID', width: 120 }
    const keyCol = { dataIndex: 'keyInValue', title: 'Key', width: 120, ellipsis: { showTitle: true } }
    const valueCol = { dataIndex: 'value', title: 'Value', ellipsis: { showTitle: true } }
    const memberCol = { dataIndex: 'value', title: 'Member', ellipsis: { showTitle: true } }
    const scoreCol = { dataIndex: 'score', title: 'Score', ellipsis: { showTitle: true } }
    const optCol = {
      dataIndex: 'row',
      title: 'Operation',
      width: 180,
      render: () => {
        return (
          <>
            <Button className="ml5" type="link" title="复制" icon={<CopyOutlined />} />
            <Button className="ml5" type="link" title="编辑" icon={<EditOutlined />} />
            <Button className="ml5" type="link" title="删除" icon={<DeleteOutlined />} />
          </>
        )
      },
    }

    switch (keyType) {
      case RedisKeyType.HASH:
        return [idxCol, keyCol, valueCol, optCol]
      case RedisKeyType.ZSET:
        return [idxCol, scoreCol, memberCol, optCol]

      default:
        return [idxCol, valueCol, optCol]
    }
  }, [keyType])
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  )
}
export default TableView
