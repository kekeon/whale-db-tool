import { mysql } from '@/types'

export const SHOW_DATABASES: mysql.queryItem = {
  type: 'query',
  sql: 'SHOW DATABASES',
}

export const USE_DATABASES_FUN = (db: string): mysql.queryItem => ({
  type: 'exec',
  sql: `USE ${db}`,
})

export const SHOW_TABLES: mysql.queryItem = {
  type: 'query',
  sql: `SHOW TABLES;`,
}

export const SHOW_KEYS_FUN = (db: string, table: string): mysql.queryItem => ({
  type: 'query',
  sql: `SHOW KEYS FROM ${db}.${table}`,
})

export const SHOW_TABLES_FUN = (db: string): mysql.queryItem => ({
  type: 'query',
  sql: 'SHOW FULL TABLES FROM `' + db + '`;',
})

export const SHOW_TABLES_COLUMNS_FUN = (db: string, table: string): mysql.queryItem => ({
  type: 'query',
  sql: `SHOW FULL COLUMNS FROM ${db}.${table};`,
})

export const SELECT_FORM_ALL_FUN = (db: string, table: string, limit?: number, offset?: number): mysql.queryItem => {
  const item: mysql.queryItem = {
    type: 'query',
    sql: `SELECT * FROM ${db}.${table}`,
  }

  if (typeof limit === 'number') {
    item.sql += ` LIMIT ${limit}`
  }

  if (typeof offset === 'number') {
    item.sql += ` OFFSET ${offset}`
  }

  return item
}

export const DESC_TABLE_FUN = (db: string, table: string): mysql.queryItem => ({
  type: 'query',
  sql: `DESC ${db}.${table} `,
})

export const DELETE_ITEM_SQL_FUN = (db: string, table: string, condition: string): mysql.queryItem => ({
  type: 'exec',
  sql: `DELETE FROM ${db}.${table} WHERE ${condition} LIMIT 1`,
})
