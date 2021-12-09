import request, { PostOpt } from '@/utils/request'
import { uuid } from '@/utils/utils'
import { REDIS_CMD } from './api'

// 基础查询
export async function redisCmd(uuid: string, option?: PostOpt) {
  return request.post(
    REDIS_CMD,
    {
      uuid: uuid,
      sql_list: [{ cmd: 'keys *' }],
    },
    option,
  )
}
