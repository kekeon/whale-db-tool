export type IKV<T> = {
  // [key in keyof T]: T
  [key in string]: T
}

export type uuid = string

export interface connectItem {
  another_name: string
  host: string
  name: string
  password: string
  port: number
}

export interface connectUuid {
  uuid: uuid
}

export interface TableConnectDesc {
  dbName: string
  uuid: uuid
  tableName: string
}

export interface connectedBase {
  user: string
  password: string
  host: string
  port: number
}

export interface connectedAdd extends connectedBase {
  user: string
  password: string
  host: string
  port: number
  type: string
  another_name: string
}

export type cuid = connectItem & connectUuid

export interface IDBItem {
  connection_uuid: uuid
  connection_host: string
  connection_another_name: string
  connection_port: string
  connection_account: string
  create_time: string
  other_info: string
  update_time: string
}

export interface IDBList {
  list: IDBItem[]
}
