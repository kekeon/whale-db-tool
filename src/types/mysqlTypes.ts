import { common } from '.'

export enum EditFormType {
  new = 'new',
  edit = 'edit',
}

export enum queryType {
  exec = 'exec',
  query = 'query',
}

export interface queryItem {
  type: 'exec' | 'query'
  sql: string
}

export interface queryProps {
  uuid: string
  sql_list: queryItem[]
}

export interface queryResponse {
  data: any[]
}

export interface tableColumnsInfo {
  Collation: string
  Comment: string
  Default: string
  Extra: string
  Field: string
  Key: string
  Null: string
  Privileges: string
  Type: string
}

export enum TableFieldType {
  tinyint = 'tinyint',
  smallint = 'smallint',
  mediumint = 'mediumint',
  int = 'int',
  integer = 'integer',
  bigint = 'bigint',
  float = 'float',
  double = 'double',
  real = 'real',
  decimal = 'decimal',
  numeric = 'numeric',
  bit = 'bit',
  bool = 'bool',
  boolean = 'boolean',
  date = 'date',
  datetime = 'datetime',
  timestamp = 'timestamp',
  time = 'time',
  year = 'year',
  binary = 'binary',
  varbinary = 'varbinary',
  char = 'char',
  varchar = 'varchar',
  tinyblob = 'tinyblob',
  tinytext = 'tinytext',
  mediumblob = 'mediumblob',
  mediumtext = 'mediumtext',
  longblob = 'longblob',
  longtext = 'longtext',
  blob = 'blob',
  text = 'text',
  json = 'json',
  set = 'set',
  enum = 'enum',
}

export interface dbBase {
  user: string
  password: string
  host: string
  port: number
}

export interface dbAdd extends dbBase {
  user: string
  password: string
  host: string
  port: number
  type: string
  another_name: string
}

export interface dbList {
  connection_uuid: common.uuid
  connection_host: string
  connection_another_name: string
  connection_port: string
  connection_account: string
  create_time: string
  other_info: string
  update_time: string
}

export interface dbObjList {
  list: dbList[]
}
