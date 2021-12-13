import { atom } from 'recoil'

export const redisDbUUidState = atom<string>({
  key: 'redisDbUUidState',
  default: '',
})
