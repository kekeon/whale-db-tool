import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-form'
import { BetaSchemaForm, ProFormSelect } from '@ant-design/pro-form'
import { useRecoilValue } from 'recoil'
import { generateEditJson } from '../../const'
import { mySqlState } from '@/store'
import { FormSchemaType } from '@/types/mysqlTypes'

import style from './index.module.less'
import { Button } from 'antd'

interface DataItem {
  name: string
  state: string
}

interface FilterForm {}
const FilterForm: React.FC<FilterForm> = () => {
  const [layoutType, setLayoutType] = useState<ProFormLayoutType>('QueryFilter')
  const [columnsList, setColumnsList] = useState<ProFormColumnsType<DataItem>[]>([])
  const columns = useRecoilValue(mySqlState.mySqlDbTableColumnsState)
  const mySqlDbStates = useRecoilValue(mySqlState.mySqlDbState)

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    visible && handleTableColumns()
  }, [visible])

  const handleTableColumns = useCallback(() => {
    console.log('columns', columns)

    const editInfo = generateEditJson(columns, {}, FormSchemaType.FILTER) || []
    console.log('editInfo', editInfo)

    setColumnsList(editInfo!)
  }, [mySqlDbStates, columns])

  const filterColumns = useMemo(() => {
    const editInfo = generateEditJson(columns, {}, FormSchemaType.FILTER) || []
    return editInfo
  }, [columns])

  useEffect(() => {
    // handleTableColumns()
    setTimeout(() => {
      setVisible(true)
    }, 1000)
  }, [])

  return (
    <div className={style.filterForm}>
      <BetaSchemaForm<DataItem>
        layoutType={layoutType}
        layout="inline"
        onReset={() => {}}
        onFinish={async (values) => {}}
        onChange={() => {
          console.log('TODO.')
        }}
        onVisibleChange={(bool) => {}}
        columns={filterColumns}
        optionRender={(searchConfig, _a, dom) => {
          return (
            <div>
              <Button className="filter-sql-btn">SQL</Button>
              {dom[0]}
              <span style={{ marginLeft: 5 }} />
              {dom[1]}
            </div>
          )
        }}
      />
    </div>
  )
}
export default FilterForm
