import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import React, { useMemo } from 'react'
interface TableViewProps<T> {
  keyType: string
  dataSource: T[]
}
const TableView = <T extends {}>({ keyType, dataSource }: TableViewProps<T>) => {
  const columns = useMemo(() => {
    return [
      { dataIndex: 'idx', title: 'ID', width: 120 },
      { dataIndex: 'value', title: 'Value', ellipsis: { showTitle: true } },
      {
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
      },
    ]
  }, [keyType])
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  )
}
export default TableView
