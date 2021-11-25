import {
  DELETE_ITEM_SQL_FUN,
  DESC_TABLE_FUN,
  SELECT_FORM_ALL_FUN,
  SHOW_DATABASES,
  SHOW_TABLES,
  SHOW_TABLES_COLUMNS_FUN,
  SHOW_TABLES_FUN,
  USE_DATABASES_FUN,
} from '@/sql/mysql.sql'
import { common, mysql } from '@/types'
import { IKV, TableConnectDesc } from '@/types/commonTypes'
import request, { GetOpt, PostOpt } from '@/utils/request'
import { generateWhereCondition, isEmpty, queryPriOrUni } from '@/utils/utils'
import { MYSQL_ADD, MYSQL_DELETE, MYSQL_LIST, MYSQL_PING, MYSQL_QUERY, MYSQL_UPDATE } from './api'

// 新增
export async function mysqlAdd(props: mysql.dbAdd, option?: PostOpt) {
  return request.post(MYSQL_ADD, props, option)
}

// 更新
export async function mysqlUpdate(props: mysql.dbAdd & common.connectUuid, option?: PostOpt) {
  return request.put(MYSQL_UPDATE, props, option)
}
// 删除
export async function mysqlDelete(props: common.connectUuid, option?: PostOpt) {
  return request.delete(MYSQL_DELETE, props, option)
}

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

// list
export async function mysqlList(option?: GetOpt) {
  try {
    const res = await request.get<mysql.dbObjList>(MYSQL_LIST, {}, option)

    return res.data?.list
  } catch (error) {
    console.warn(error)
    return []
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
  },
  option?: PostOpt,
) {
  let p: mysql.queryProps = {
    uuid: uuid,
    sql_list: [SELECT_FORM_ALL_FUN(db, table, extraParams?.limit, extraParams?.offset) /* DESC_TABLE_FUN(db, table) */],
  }
  const res = await mysqlQuery(p, option)
  let data: any = {
    columns: [],
    list: [],
  }
  if (Array.isArray(res.data) && res.data[0] && Array.isArray(res.data[0]['data'])) {
    data.columns = res.data[0]['columns'].map((item: any) => {
      let o = {
        dataIndex: item['Field'],
        title: item['Field'],
        ...item,
      }
      return o
    })
    data.list = res.data[0]['data'].map((item) => {
      return item
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
