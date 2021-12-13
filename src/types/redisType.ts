import { uuid } from './commonTypes'

export interface RedisCmdItem {
  cmd: string[]
}

export interface RedisQueryItem {
  cmd: string[]
  uuid: uuid
}

export interface IRedisQueryResponseBase<T> {
  data: T
  err_msg: string
}
