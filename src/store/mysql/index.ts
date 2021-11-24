import { MySqlDbStateType, mySqlQueryType } from '@/store/mysql/types'
import { mysql } from '@/types'
import { ColumnProps } from 'antd/lib/table'
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
    limit: 1000,
    offset: 0,
  },
})

export const mySqlDbTableColumnsState = atom<Partial<mysql.tableColumnsInfo> & ColumnProps<any>[]>({
  key: 'mySqlDbTableInfoState',
  default: [],
})

export const mySqlQueryTypeState = atom<mySqlQueryType>({
  key: 'mySqlQueryTypeState',
  default: mySqlQueryType.SYSTEM,
})
