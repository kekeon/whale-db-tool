import {
  QUERY_DB_CONFIG_FUNC,
  QUERY_DB_DELETE_KEY_FUNC,
  QUERY_DB_KEYS,
  QUERY_DB_RENAME_KEY_FUNC,
  QUERY_DB_SCAN_KEYS_FUNC,
  QUERY_SELECT_DB_FUNC,
} from '@/statement/redis.cmd'
import { uuid } from '@/types/commonTypes'
import { dbBase } from '@/types/mysqlTypes'
import {
  IRedisKeyInValue,
  IRedisKeyInValueItem,
  IRedisKeyMemberRemove,
  IRedisKeySetValue,
  IRedisQueryResponseBase,
  RedisCmdItem,
} from '@/types/redisType'
import request, { PostOpt } from '@/utils/request'
import { REDIS_CMD, REDIS_KEY_MEMBER_REMOVE, REDIS_KEY_SET, REDIS_KEY_VALUE, REDIS_PING } from './api'

// 基础查询
export async function redisCmd<T>(uuid: string, cmdList: RedisCmdItem[], option?: PostOpt) {
  return request.post<T>(
    REDIS_CMD,
    {
      uuid: uuid,
      cmd_list: cmdList,
    },
    option,
  )
}

// 监测 redis 有效性
export async function redisPing(props: dbBase, option?: PostOpt) {
  try {
    const res = await request.post(REDIS_PING, props, option)
    return res.data
  } catch (error) {
    console.warn(error)
    return false
  }
}

// 查询数据库的字段配置
export async function redisConfigCmd<T>(uuid: string, field: string, option?: PostOpt) {
  return request.post<T>(
    REDIS_CMD,
    {
      uuid: uuid,
      cmd_list: QUERY_DB_CONFIG_FUNC(field),
    },
    option,
  )
}

// 查询 redis 返回的keys
export async function redisKeysCmd(
  uuid: string,
  params: { start: number; count: number; matchKey: string },
  option?: PostOpt,
) {
  try {
    const res = await redisCmd<IRedisQueryResponseBase<string[]>[]>(
      uuid,
      QUERY_DB_SCAN_KEYS_FUNC(params.start, params.count, params.matchKey),
      option,
    )
    console.log('redisKeysCmd', res)

    // return res?.data[0]?.data
    return { keys: res?.data[0]?.data?.[1], cursor: res?.data[0]?.data?.[0] }
  } catch {
    return { keys: [], cursor: '0' }
  }
}

// 查询 redis 库的数量
export async function redisDbNumber(uuid: string) {
  try {
    const res = await redisConfigCmd<IRedisQueryResponseBase<string[]>[]>(uuid, 'databases')
    return res?.data[0]?.data?.[1]
  } catch {
    return 0
  }
}

// 切换 redis 库
export async function redisSelectDb(uuid: string, index: number) {
  try {
    const res = await redisCmd<IRedisQueryResponseBase<string[]>[]>(uuid, QUERY_SELECT_DB_FUNC(index))
    return res
  } catch {
    return 0
  }
}

// 删除键
export async function redisDeleteKey(uuid: string, key: string) {
  try {
    const res = await redisCmd<IRedisQueryResponseBase<string[]>[]>(uuid, QUERY_DB_DELETE_KEY_FUNC(key))
    return res
  } catch {
    return 0
  }
}

export async function redisRenameKey(uuid: string, params: { key: string; newKey: string }) {
  try {
    const res = await redisCmd<IRedisQueryResponseBase<string[]>[]>(
      uuid,
      QUERY_DB_RENAME_KEY_FUNC(params.key, params.newKey),
    )
    return res
  } catch {
    return null
  }
}

export async function redisKeyValue(uuid: string, key: string) {
  try {
    const res = await request.post<IRedisQueryResponseBase<IRedisKeyInValueItem[]>[]>(REDIS_KEY_VALUE, {
      uuid,
      key_list: [key],
    })
    return res
  } catch {
    return null
  }
}

export async function redisKeySet(data: IRedisKeySetValue) {
  try {
    const res = await request.post<IRedisQueryResponseBase<IRedisKeyInValue>>(REDIS_KEY_SET, data)
    return res
  } catch {
    return null
  }
}

export async function redisKeyMemberRemove(data: IRedisKeyMemberRemove) {
  try {
    const res = await request.post<IRedisQueryResponseBase<IRedisKeyInValue>>(REDIS_KEY_MEMBER_REMOVE, data)
    return res
  } catch {
    return null
  }
}
