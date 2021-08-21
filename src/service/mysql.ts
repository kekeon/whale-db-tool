import {
  DELETE_ITEM_SQL_FUN,
  DESC_TABLE_FUN,
  SELECT_FORM_ALL_FUN,
  SHOW_DATABASES,
  SHOW_TABLES,
  SHOW_TABLES_COLUMNS_FUN,
  SHOW_TABLES_FUN,
  USE_DATABASES_FUN,
} from "@/sql/mysql.sql";
import { mysql } from "@/types";
import request, { PostOpt } from "@/utils/request";
import { generateWhereCondition, isEmpty, queryPriOrUni } from "@/utils/utils";
import { MYSQL_QUERY } from "./api";

// 基础查询
export async function mysqlQuery(props: mysql.queryProps, option?: PostOpt) {
  return request.post(MYSQL_QUERY, props, option);
}

// 查询数据库
export async function mysqlDbQuery(uuid: string, option?: PostOpt) {
  let p: mysql.queryProps = { uuid: "123", sql_list: [SHOW_DATABASES] };
  const res = await mysqlQuery(p, option);
  if (
    Array.isArray(res.data) &&
    res.data[0] &&
    Array.isArray(res.data[0]["data"])
  ) {
    let d: any = res.data[0]["data"].map((item: any) => ({
      name: item.Database,
    }));
    return d;
  }

  return [];
}

// 查询数据库中的表
export async function mysqlTableQuery(
  uuid: string,
  db: string,
  option?: PostOpt
) {
  let p: mysql.queryProps = {
    uuid: uuid,
    sql_list: [SHOW_TABLES_FUN(db)],
  };
  const res = await mysqlQuery(p, option);
  if (
    Array.isArray(res.data) &&
    res.data[0] &&
    Array.isArray(res.data[0]["data"])
  ) {
    let d: any = res.data[0]["data"].map((item: any) => ({
      name: item[`Tables_in_${db}`],
    }));
    return d;
  }

  return [];
}

// 查询表中的所有数据
export async function mysqlTableDataQuery(
  uuid: string,
  db: string,
  table: string,
  extraParams?: {
    limit: number;
    offset: number;
  },
  option?: PostOpt
) {
  let p: mysql.queryProps = {
    uuid: uuid,
    sql_list: [SELECT_FORM_ALL_FUN(db, table), DESC_TABLE_FUN(db, table)],
  };
  const res = await mysqlQuery(p, option);
  let data: any = {
    columns: [],
    list: [],
  };
  if (
    Array.isArray(res.data) &&
    res.data[0] &&
    Array.isArray(res.data[0]["data"])
  ) {
    data.columns = res.data[1]["data"].map((item: any) => {
      let o = {
        dataIndex: item["Field"],
        title: item["Field"],
        ...item,
      };
      return o;
    });
    data.list = res.data[0]["data"].map(item => {

      return item
    });
  }

  return data;
}

// 查询表结构
export async function mysqlTableDescQuery(
  uuid: string,
  db: string,
  table: string,
  option?: PostOpt
) {
  let p: mysql.queryProps = {
    uuid: uuid,
    sql_list: [DESC_TABLE_FUN(db, table)],
  };
  const res = await mysqlQuery(p, option);
  if (
    Array.isArray(res.data) &&
    res.data[0] &&
    Array.isArray(res.data[0]["data"])
  ) {
    /* let d: any = res.data[1]["data"].map((item: any) => ({
          name: item[`Tables_in_${db}`],
        }));
        return d; */
    return res.data[0]["data"];
  }

  return [];
}

// 查询详细表结构
export async function mysqlTableColumnsShowFull(
  uuid: string,
  db: string,
  table: string,
  option?: PostOpt
) {
  let p: mysql.queryProps;
  p = {
    uuid: uuid,
    sql_list: [SHOW_TABLES_COLUMNS_FUN(db, table)],
  };
  const res = await mysqlQuery(p, option);
  if (
    Array.isArray(res.data) &&
    res.data[0] &&
    Array.isArray(res.data[0]["data"])
  ) {
    /* let d: any = res.data[1]["data"].map((item: any) => ({
              name: item[`Tables_in_${db}`],
            }));
            return d; */
    return res.data[0]["data"];
  }

  return [];
}

// 执行sql
export async function mysqlTableExecQuery(
  uuid: string,
  sqlList: mysql.queryItem[],
  option?: PostOpt
) {
  let p: mysql.queryProps = {
    uuid: uuid,
    sql_list: sqlList,
  };
  const res = await mysqlQuery(p, option);
  let data: any = {
    columns: [],
    list: [],
  };
  if (
    Array.isArray(res.data) &&
    res.data[1] &&
    Array.isArray(res.data[1]["data"])
  ) {
    let keys = Object.keys(res.data[1]["data"][0]);

    data.columns = keys.map((k: any) => ({
      dataIndex: k,
      title: k,
    }));
    data.list = res.data[1]["data"];
  }

  return data;
}

// 删除 sql
export async function mysqlTableDeleteItem(
  uuid: string,
  db: string,
  table: string,
  tableDesc: IKV<string>[],
  deleteList: IKV<string>[],
  option?: PostOpt
) {
  const pk = queryPriOrUni(tableDesc);


  const sqlList: mysql.queryItem[] = deleteList.map((item) => {
    const condition: string = generateWhereCondition(tableDesc, item, pk);

    return DELETE_ITEM_SQL_FUN(db, table, condition);
  });

  const res = await mysqlQuery(
    {
      uuid: uuid,
      sql_list: sqlList,
    },
    option
  );

  return res;
}
