import { ConnectedEnum } from '@/constant/js'
import { common } from '@/types'
import { IDBList } from '@/types/commonTypes'
import request, { GetOpt, PostOpt } from '@/utils/request'
import { CONNECTED_ADD, CONNECTED_DELETE, CONNECTED_LIST, CONNECTED_UPDATE } from './api'

// 新增
export async function connectedAdd(props: common.connectedAdd, option?: PostOpt) {
  return request.post(CONNECTED_ADD, props, option)
}

// 更新
export async function connectedUpdate(props: common.connectedAdd & common.connectUuid, option?: PostOpt) {
  return request.put(CONNECTED_UPDATE, props, option)
}
// 删除
export async function connectedDelete(props: common.connectUuid, option?: PostOpt) {
  return request.delete(CONNECTED_DELETE, props, option)
}

// list
export async function connectedList(params: ConnectedEnum, option?: GetOpt) {
  try {
    const res = await request.get<IDBList>(CONNECTED_LIST, { type: params }, option)

    return res.data?.list
  } catch (error) {
    console.warn(error)
    return []
  }
}
