import { RedisCmdItem } from '@/types/redisType'

export const QUERY_DB_KEYS: RedisCmdItem[] = [{ cmd: ['keys', '*'] }]
export const QUERY_DB_CONFIG_FUNC = (field: string): RedisCmdItem[] => [{ cmd: ['CONFIG', 'GET', field] }]
export const QUERY_SELECT_DB_FUNC = (index: number): RedisCmdItem[] => [{ cmd: ['SELECT', String(index)] }]
export const QUERY_DB_DELETE_KEY_FUNC = (field: string): RedisCmdItem[] => [{ cmd: ['DEL', field] }]
export const QUERY_DB_RENAME_KEY_FUNC = (key: string, newKey: string): RedisCmdItem[] => [
  { cmd: ['RENAME', key, newKey] },
]
