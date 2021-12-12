import { QUERY_DB_CONFIG_FUNC, QUERY_DB_KEYS } from '@/statement/redis.cmd'
import { dbBase } from '@/types/mysqlTypes'
import { RedisCmdItem } from '@/types/redisType'
import request, { PostOpt } from '@/utils/request'
import { REDIS_CMD, REDIS_PING } from './api'

// 基础查询
export async function redisCmd(uuid: string, cmdList: RedisCmdItem[], option?: PostOpt) {
  return request.post(
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

export async function redisKeysCmd(uuid: string, option?: PostOpt) {
  return redisCmd(uuid, QUERY_DB_KEYS, option)
}

export async function redisConfigCmd(uuid: string, field: string, option?: PostOpt) {
  return request.post(
    REDIS_CMD,
    {
      uuid: uuid,
      cmd_list: QUERY_DB_CONFIG_FUNC(field),
    },
    option,
  )
}
