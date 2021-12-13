import { QUERY_DB_CONFIG_FUNC, QUERY_DB_KEYS, QUERY_SELECT_DB_FUNC } from '@/statement/redis.cmd'
import { dbBase } from '@/types/mysqlTypes'
import { IRedisQueryResponseBase, RedisCmdItem } from '@/types/redisType'
import request, { PostOpt } from '@/utils/request'
import { REDIS_CMD, REDIS_PING } from './api'

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

export async function redisPing(props: dbBase, option?: PostOpt) {
  try {
    const res = await request.post(REDIS_PING, props, option)
    return res.data
  } catch (error) {
    console.warn(error)
    return false
  }
}

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

export async function redisKeysCmd(uuid: string, option?: PostOpt) {
  try {
    const res = await redisCmd<IRedisQueryResponseBase<string[]>[]>(uuid, QUERY_DB_KEYS, option)
    return res?.data[0]?.data
  } catch {
    return []
  }
}

export async function redisDbNumber(uuid: string) {
  try {
    const res = await redisConfigCmd<IRedisQueryResponseBase<string[]>[]>(uuid, 'databases')
    return res?.data[0]?.data?.[1]
  } catch {
    return 0
  }
}

export async function redisSelectDb(uuid: string, index: number) {
  try {
    const res = await redisCmd<IRedisQueryResponseBase<string[]>[]>(uuid, QUERY_SELECT_DB_FUNC(index))
    return res
  } catch {
    return 0
  }
}
