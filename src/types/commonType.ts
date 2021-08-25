declare interface IKV<T> {
  [index: string]: T
}

namespace conmon {
  export type uuid = string

  export type connectItem = {
    another_name: string
    host: string
    name: string
    password: string
    port: number
  }

  export type connectUuid = {
    uuid: uuid
  }

  export type cuid = connectItem & connectUuid
}
