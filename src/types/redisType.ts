import { uuid } from './commonTypes'

export enum RedisKeyType {
  STRING = 'string',
  SET = 'set',
  ZSET = 'zset',
  LIST = 'list',
  HASH = 'hash',
}

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

export interface IRedisKeyInValue {
  type: string
  value: unknown
}

export interface IRedisKeyInValueItem {
  data: IRedisKeyInValue
  err_msg: string
}

export interface IRedisKeySetValue {
  uuid: uuid
  key_type: RedisKeyType
  line_key: string
  key: string
  value?: string | unknown[]
}

export interface IRedisKeyMemberRemove {
  uuid: uuid
  key: string
  member: string
}
