import React, { useMemo } from 'react'
import { BetaSchemaForm } from '@ant-design/pro-form'
import { useRecoilValue } from 'recoil'
import { generateEditJson } from '../../const'
import { mySqlState } from '@/store'
import { FormSchemaType } from '@/types/mysqlTypes'

import style from './index.module.less'
import { Button } from 'antd'
import { mysql } from '@/types'
import { useForm } from 'antd/lib/form/Form'
import classNames from 'classnames'

interface FilterForm {
  onSearch?: (values: mysql.FilterDataItem) => void
  onShowSql?: (values: mysql.FilterDataItem) => void
  onReset?: () => void
}
const FilterForm: React.FC<FilterForm> = ({ onSearch, onShowSql, onReset }) => {
  const columns = useRecoilValue(mySqlState.mySqlDbTableColumnsState)
  const filterForm = useForm<mysql.FilterDataItem>()
  const filterColumns = useMemo(() => {
    const editInfo =
      generateEditJson<mysql.FilterDataItem>(columns as mysql.tableColumnsInfo[], {}, FormSchemaType.FILTER) || []
    return editInfo
  }, [columns])

  const handleSql = () => {
    const values = filterForm[0]?.getFieldsValue?.()
    onShowSql?.(values)
  }

  return (
    <div
      className={classNames(style.filterForm, {
        [style.formHide]: filterColumns.length === 0,
      })}
    >
      <BetaSchemaForm<mysql.FilterDataItem>
        layoutType="QueryFilter"
        layout="inline"
        onReset={onReset}
        onFinish={async (values) => {
          onSearch?.(values)
        }}
        ref={filterForm}
        onVisibleChange={(bool) => {}}
        columns={filterColumns}
        // eslint-disable-next-line react/no-unstable-nested-components
        optionRender={(_searchConfig, _a, dom) => {
          return (
            <div>
              <Button className="filter-sql-btn" onClick={handleSql}>
                SQL
              </Button>
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
