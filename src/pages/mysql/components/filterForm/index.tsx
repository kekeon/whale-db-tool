import React, { useCallback, useEffect, useState } from 'react'
import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-form'
import { BetaSchemaForm, ProFormSelect } from '@ant-design/pro-form'
import { useRecoilValue } from 'recoil'
import { generateEditJson } from '../../const'
import { mySqlState } from '@/store'

interface DataItem {
  name: string
  state: string
}

interface FilterForm {}
const FilterForm: React.FC<FilterForm> = () => {
  const [layoutType, setLayoutType] = useState<ProFormLayoutType>('Form')
  const [columnsList, setColumnsList] = useState<ProFormColumnsType<DataItem>[]>([])
  const columns = useRecoilValue(mySqlState.mySqlDbTableColumnsState)
  const mySqlDbStates = useRecoilValue(mySqlState.mySqlDbState)

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    visible && handleTableColumns()
  }, [visible])

  const handleTableColumns = useCallback(async () => {
    const editInfo = generateEditJson(columns)
    setColumnsList(editInfo!)
  }, [mySqlDbStates, columns])

  return (
    <div>
      <BetaSchemaForm<DataItem>
        layoutType={layoutType}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        visible={visible}
        onReset={() => {}}
        onFinish={async (values) => {}}
        onChange={() => {
          console.log('TODO.')
        }}
        onVisibleChange={(bool) => {}}
        columns={columnsList}
      />
    </div>
  )
}
export default FilterForm
