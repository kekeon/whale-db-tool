import {
  DELETE_ITEM_SQL_FUN,
  DESC_TABLE_FUN,
  SELECT_FORM_ALL_FUN,
  SHOW_DATABASES,
  SHOW_TABLES_COLUMNS_FUN,
  SHOW_TABLES_FUN,
} from '@/statement/mysql.sql'
import { mysql } from '@/types'
import { IKV, TableConnectDesc } from '@/types/commonTypes'
import request, { PostOpt } from '@/utils/request'
import { generateWhereCondition, isEmpty, queryPriOrUni } from '@/utils/utils'
import { MYSQL_PING, MYSQL_QUERY } from './api'

// ping 检测
export async function mysqlPing(props: mysql.dbBase, option?: PostOpt) {
  try {
    const res = await request.post(MYSQL_PING, props, option)
    return res.data
  } catch (error) {
    console.warn(error)
    return false
  }
}

// 基础查询
export async function mysqlQuery(props: mysql.queryProps, option?: PostOpt) {
  return request.post(MYSQL_QUERY, props, option)
}

// 查询数据库
export async function mysqlDbQuery(uuid: string, option?: PostOpt) {
  try {
    let p: mysql.queryProps = { uuid: uuid, sql_list: [SHOW_DATABASES] }
    const res = await mysqlQuery(p, option)
    if (Array.isArray(res.data) && res.data[0] && Array.isArray(res.data[0]['data'])) {
      let d: any = res.data[0]['data'].map((item: any) => ({
        name: item.Database,
      }))
      return d
    }
  } catch (error) {
    console.log(error)
    return []
  }
}

// 查询数据库中的表
export async function mysqlTableQuery(uuid: string, db: string, option?: PostOpt) {
  let p: mysql.queryProps = {
    uuid: uuid,
    sql_list: [SHOW_TABLES_FUN(db)],
  }
  const res = await mysqlQuery(p, option)
  if (Array.isArray(res.data) && res.data[0] && Array.isArray(res.data[0]['data'])) {
    let d: any = res.data[0]['data'].map((item: any) => ({
      name: item[`Tables_in_${db}`],
    }))
    return d
  }

  return []
}

// 查询表中的所有数据
export async function mysqlTableDataQuery(
  uuid: string,
  db: string,
  table: string,
  extraParams?: {
    limit?: number
    offset?: number
    where?: string
  },
  option?: PostOpt,
) {
  let p: mysql.queryProps = {
    uuid: uuid,
    sql_list: [
      SELECT_FORM_ALL_FUN(db, table, extraParams?.limit, extraParams?.offset, extraParams?.where),
      SHOW_TABLES_COLUMNS_FUN(db, table),
    ],
  }
  const res = await mysqlQuery(p, option)
  let data: any = {
    columns: [],
    list: [],
  }
  if (Array.isArray(res.data) && res.data[0] && Array.isArray(res.data[0]['data'])) {
    data.list = res.data[0]['data'].map((item) => {
      return item
    })
  }

  if (Array.isArray(res.data) && res.data[1] && Array.isArray(res.data[1]['data'])) {
    data.columns = res.data[1]['data'].map((item: any) => {
      let o = {
        dataIndex: item['Field'],
        title: item['Field'],
        ...item,
      }
      return o
    })
  }

  return data
}

// 查询表结构
export async function mysqlTableDescQuery(uuid: string, db: string, table: string, option?: PostOpt) {
  let p: mysql.queryProps = {
    uuid: uuid,
    sql_list: [DESC_TABLE_FUN(db, table)],
  }
  const res = await mysqlQuery(p, option)
  if (Array.isArray(res.data) && res.data[0] && Array.isArray(res.data[0]['data'])) {
    return res.data[0]['data']
  }

  return []
}

// 查询详细表结构
export async function mysqlTableColumnsShowFull(uuid: string, db: string, table: string, option?: PostOpt) {
  let p: mysql.queryProps
  p = {
    uuid: uuid,
    sql_list: [SHOW_TABLES_COLUMNS_FUN(db, table)],
  }
  const res = await mysqlQuery(p, option)
  if (Array.isArray(res.data) && res.data[0] && Array.isArray(res.data[0]['data'])) {
    return res.data[0]['data']
  }

  return []
}

// 执行sql
export async function mysqlTableExecQuery(uuid: string, sqlList: mysql.queryItem[], option?: PostOpt) {
  let p: mysql.queryProps = {
    uuid: uuid,
    sql_list: sqlList,
  }
  const res = await mysqlQuery(p, option)
  let data: any = {
    columns: [],
    list: [],
  }
  if (Array.isArray(res.data) && res.data[1] && Array.isArray(res.data[1]['data'])) {
    data.columns = res.data[1]?.['columns'].map((col: any) => ({
      dataIndex: col.Field,
      title: col.Field,
      Type: col.Type,
    }))
    data.list = res?.data[1]?.['data']
    data.errMsg = res?.data[1]?.['err_msg']
  }

  if (Array.isArray(res.data) && res.data[1] && res?.data[1]?.['err_msg']) {
    data.errMsg = res?.data[1]?.['err_msg']
  }

  return data
}

// 删除 sql
export async function mysqlTableDeleteItem(
  connectionDesc: TableConnectDesc,
  tableDesc: IKV<string>[],
  deleteList: IKV<string>[],
  option?: PostOpt,
) {
  const pk = queryPriOrUni(tableDesc)

  const sqlList: mysql.queryItem[] = deleteList.map((item) => {
    const condition: string = generateWhereCondition(tableDesc, item, pk)

    return DELETE_ITEM_SQL_FUN(connectionDesc.dbName, connectionDesc.tableName, condition)
  })

  const res = await mysqlQuery(
    {
      uuid: connectionDesc.uuid,
      sql_list: sqlList,
    },
    option,
  )

  return res
}
