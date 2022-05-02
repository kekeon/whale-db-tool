import { RedisKeyType } from '@/types/redisType'
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import React, { useMemo } from 'react'
import DbClipboardNode from '_cp/DbClipboardNode'
interface TableViewProps<T> {
  keyType: string
  dataSource: T[]
  onEdit?: (row: T) => void
  onRemove?: (row: T) => void
  onAdd?: (row: T) => void
}

const TableView = <T extends {}>({ keyType, dataSource, onEdit, onRemove, onAdd }: TableViewProps<T>) => {
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
      render: (_, row: T) => {
        return (
          <>
            <DbClipboardNode text={row?.value} copyIconProps={{ title: '拷贝', className: 'ml5 hover-scale' }} />
            <Button
              className="ml5 hover-scale"
              type="link"
              title="编辑"
              icon={<EditOutlined />}
              onClick={() => onEdit?.(row)}
            />
            <Button
              className="ml5 hover-scale"
              type="link"
              title="删除"
              icon={<DeleteOutlined />}
              onClick={() => onRemove?.(row)}
            />
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
      <Button type="primary" style={{ marginBottom: '10px' }} onClick={onAdd}>
        新增
      </Button>
      <Table size="small" columns={columns} rowKey="idx" dataSource={dataSource} />
    </div>
  )
}
export default TableView
