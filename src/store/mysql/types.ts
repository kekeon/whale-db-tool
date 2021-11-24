export interface MySqlDbStateType {
  dbName: string
  tableName: string
  offset: number
  limit: number
}

export enum mySqlQueryType {
  SYSTEM,
  SELF,
}
