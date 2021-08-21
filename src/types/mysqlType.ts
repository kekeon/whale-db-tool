export namespace mysql {
  export enum EditFormType {
    new = 'new',
    edit = 'edit',
  }

  export enum queryType {
    exec = 'exec',
    query = 'query',
  }

  export type queryItem = {
    type: 'exec' | 'query'
    sql: string
  }

  export type queryProps = {
    uuid: string
    sql_list: queryItem[]
  }

  export type queryResponse = {
    data: any[]
  }

  export interface tableColumsInfo {
    Collation: string
    Comment: string
    Default: string
    Extra: string
    Field: string
    Key: string
    Null: string
    Privileges: string
    Type: string
  }

  export enum TableFieldType {
    tinyint = 'tinyint',
    smallint = 'smallint',
    mediumint = 'mediumint',
    int = 'int',
    integer = 'integer',
    bigint = 'bigint',
    float = 'float',
    double = 'double',
    real = 'real',
    decimal = 'decimal',
    numeric = 'numeric',
    bit = 'bit',
    bool = 'bool',
    boolean = 'boolean',
    date = 'date',
    datetime = 'datetime',
    timestamp = 'timestamp',
    time = 'time',
    year = 'year',
    binary = 'binary',
    varbinary = 'varbinary',
    char = 'char',
    varchar = 'varchar',
    tinyblob = 'tinyblob',
    tinytext = 'tinytext',
    mediumblob = 'mediumblob',
    mediumtext = 'mediumtext',
    longblob = 'longblob',
    longtext = 'longtext',
    blob = 'blob',
    text = 'text',
    json = 'json',
    set = 'set',
    enum = 'enum',
  }
}
