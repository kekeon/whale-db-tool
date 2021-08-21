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

const columns: ProFormColumnsType<DataItem>[] = [
  {
    title: '标题',
    dataIndex: 'title',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    width: 'm',
  },
  {
    title: '状态',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum,
    width: 'm',
  },
  {
    title: '标签',
    dataIndex: 'labels',
    width: 'm',
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'createName',
    valueType: 'date',
  },
  {
    title: '分组',
    valueType: 'group',
    columns: [
      {
        title: '状态',
        dataIndex: 'groupState',
        valueType: 'select',
        width: 'xs',
        valueEnum,
      },
      {
        title: '标题',
        width: 'md',
        dataIndex: 'groupTitle',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
      },
    ],
  },
  {
    title: '列表',
    valueType: 'formList',
    dataIndex: 'list',
    initialValue: [{ state: 'all', title: '标题' }],
    columns: [
      {
        valueType: 'group',
        columns: [
          {
            title: '状态',
            dataIndex: 'state',
            valueType: 'select',
            width: 'xs',
            valueEnum,
          },
          {
            title: '标题',
            dataIndex: 'title',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '此项为必填项',
                },
              ],
            },
            width: 'm',
          },
        ],
      },
    ],
  },
  {
    title: 'FormSet',
    valueType: 'formSet',
    dataIndex: 'formSet',
    columns: [
      {
        title: '状态',
        dataIndex: 'groupState',
        valueType: 'select',
        width: 'xs',
        valueEnum,
      },
      {
        title: '标题',
        dataIndex: 'groupTitle',
        tip: '标题过长会自动收缩',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
        width: 'm',
      },
    ],
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    transform: (value) => {
      return {
        startTime: value[0],
        endTime: value[1],
      }
    },
  },
]

const EditRowForm: React.FC<EditRowFormProps> = ({ visible, formType, editData, toggle, onSuccess }) => {
  const [layoutType, setLayoutType] = useState<ProFormLayoutType>('DrawerForm')
  const [columnsList, setColumnsList] = useState<ProFormColumnsType<DataItem>[]>([])

  const tableDesc = useRef<any>()

  const mySqlDbStates = useRecoilValue(mySqlState.mySqlDbState)
  const columns = useRecoilValue(mySqlState.mySqlDbTableColumsState)
  useEffect(() => {
    handleTableColumns()
  }, [mySqlDbStates])

  const handleTableColumns = useCallback(async () => {
    const res = await mysqlTableColumnsShowFull('', mySqlDbStates.dbName!, mySqlDbStates.tableName!)

    tableDesc.current = res
  }, [mySqlDbStates])

  const columnsListMemo: any = useMemo(() => {
    if (!isEmptyArray(tableDesc.current) && visible) {
      const editInfo = generateEditJson(tableDesc.current, editData)
      console.log('editInfo', editInfo)

      setColumnsList(editInfo)
      return editInfo
    }

    return []
  }, [visible])

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
        let sql = formatInsert(mySqlDbStates.dbName!, mySqlDbStates.tableName!, columnsList, [values])

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
        let data: any = await mysqlTableExecQuery('uuid', sqlList)
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
        columns={columnsListMemo}
      />
    </>
  )
}

export default EditRowForm
