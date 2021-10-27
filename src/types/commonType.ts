declare interface IKV<T> {
  [index: string]: T
}

export namespace common {
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

  export type cuid = connectItem & connectUuid
}
