import { MySqlDbStateType } from '@/store/mysqlState/types'
import { mysql } from '@/types'
import { atom } from 'recoil'

export const mySqlDbUUid = atom<string>({
  key: 'mySqlDbUUidState',
  default: '',
})

export const mySqlDbState = atom<Partial<MySqlDbStateType>>({
  key: 'mySqlDbNameState',
  default: {
    tableName: '',
    dbName: '',
  },
})

export const mySqlDbTableColumsState = atom<Partial<mysql.tableColumsInfo>[]>({
  key: 'mySqlDbTableInfoState',
  default: [],
})
