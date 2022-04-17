import { atom } from 'recoil'

export const commonGlobalLoading = atom<boolean>({
  key: 'commonGlobalLoading',
  default: false,
})
