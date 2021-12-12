import { RedisCmdItem } from '@/types/redisType'

export const QUERY_DB_KEYS: RedisCmdItem[] = [{ cmd: ['keys', '*'] }]
export const QUERY_DB_CONFIG_FUNC = (field: string): RedisCmdItem[] => [{ cmd: ['CONFIG', 'GET', field] }]
