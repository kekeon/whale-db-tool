import { generateEditJson } from '@/pages/mysql/const'
import { mysqlTableColumnsShowFull, mysqlTableExecQuery } from '@/service/mysql'
import { USE_DATABASES_FUN } from '@/sql/mysql.sql'
import { mySqlState } from '@/store'
import { mysql } from '@/types'
import { formatInsert, formatUpdateValid, isEmptyArray } from '@/utils/utils'
import { BetaSchemaForm, ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-form'
import { message } from 'antd'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'

interface EditRowFormProps {
  visible: boolean
  formType?: mysql.EditFormType
  toggle: (b: boolean) => void
  onSuccess?: () => void
  editData?: any
}

const valueEnum = {
  all: { text: '全部', status: 'Default' },
  open: {
    text: '未解决',
    status: 'Error',
  },
  closed: {
    text: '已解决',
    status: 'Success',
    disabled: true,
  },
  processing: {
    text: '解决中',
    status: 'Processing',
  },
}

type DataItem = {
  name: string
  state: string
}

const EditRowForm: React.FC<EditRowFormProps> = ({ visible, formType, editData, toggle, onSuccess }) => {
  const [layoutType, setLayoutType] = useState<ProFormLayoutType>('DrawerForm')
  const [columnsList, setColumnsList] = useState<ProFormColumnsType<DataItem>[]>([])

  const mySqlDbStates = useRecoilValue(mySqlState.mySqlDbState)
  const dbUuid = useRecoilValue(mySqlState.mySqlDbUUid)
  const columns = useRecoilValue(mySqlState.mySqlDbTableColumnsState)
  useEffect(() => {
    visible && handleTableColumns()
  }, [visible])

  const handleTableColumns = useCallback(async () => {
    const res = await mysqlTableColumnsShowFull(dbUuid, mySqlDbStates.dbName!, mySqlDbStates.tableName!)

    const editInfo = generateEditJson(res, editData)
    console.log('editData', editData, editInfo)

    setColumnsList(editInfo)
  }, [mySqlDbStates, editData])

  const handleSave = useCallback(
    async (values) => {
      const columnList: string[] = []
      columnsList.forEach((item) => {
        let k: string = item.dataIndex as string
        if (values[k] !== undefined) {
          columnList.push(k)
        }
      })

      if (!isEmptyArray(columnList)) {
        let sql = formatInsert(mySqlDbStates.dbName!, mySqlDbStates.tableName!, columns, [values])

        if (formType === mysql.EditFormType.edit) {
          sql = formatUpdateValid(mySqlDbStates.dbName!, mySqlDbStates.tableName!, columns, [values], editData)
        }

        if (!sql) {
          message.warning('未更新任何数据')
          return
        }

        let sqlList: mysql.queryItem[] = [
          USE_DATABASES_FUN(mySqlDbStates.dbName || ''),
          {
            type: 'exec',
            sql: sql,
          },
        ]
        let data: any = await mysqlTableExecQuery(dbUuid, sqlList)
        toggle(false)
        onSuccess?.()
      }
    },
    [columnsList, mySqlDbStates],
  )

  if (!visible) {
    return null
  }
  return (
    <>
      <BetaSchemaForm<DataItem>
        layoutType={layoutType}
        layout={'horizontal'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        visible={visible}
        onReset={() => {}}
        onFinish={async (values) => {
          console.log(values)
          handleSave(values)
        }}
        onChange={() => {
          console.log('TODO.')
        }}
        onVisibleChange={(bool) => {
          toggle(bool)
        }}
        columns={columnsList}
      />
    </>
  )
}

export default EditRowForm
