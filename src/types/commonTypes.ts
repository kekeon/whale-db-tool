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

export type cuid = connectItem & connectUuid
