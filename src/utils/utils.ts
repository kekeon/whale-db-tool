import { IKV } from '@/types/commonTypes'

export function uuid(len = 16, radix = 16): string {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  let radixNum = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radixNum)]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        // eslint-disable-next-line eqeqeq
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

/**
 *
 * @param {*} val '', null, undefined,false
 */
export function isEmpty(val: unknown) {
  return val === '' || val === undefined || val === null || val === false
}

export function isFunction(val: unknown) {
  return typeof val === 'function'
}

export function isObject(val: unknown) {
  return typeof val === 'object' && !Array.isArray(val)
}

export function isEmptyArray(val: unknown) {
  return !Array.isArray(val) || val.length === 0
}

export function undefinedToValue(val: unknown, fieldDesc: any) {
  if (fieldDesc.Null === 'NO' && !val) {
    return ''
  }
  return val === undefined ? 'null' : `'${val}'`
}

/**
 * 格式化生成 insert sql 语句
 * @param {string} db
 * @param {string} table
 * @param {string[]} colums
 * @param {IKV<unknown>[]} data
 * @returns {string}
 */
export function formatInsert(db: string, table: string, columns: any[], data: IKV<unknown>[]): string {
  let field = columns.map((s) => '`' + s.Field + '`')

  let sqlList: string[] = data.map((item) => {
    let arr = columns.map((k) => {
      return `${undefinedToValue(item[k.Field], k)}`
    })
    return 'INSERT INTO `' + db + '`.`' + table + '` (' + field.join(',') + ') VALUES (' + arr.join(',') + '); '
  })

  return sqlList.join('\n')
}

/**
 * 格式化生成 update sql 语句
 * @param {string} db
 * @param {string} table
 * @param {string[]} colums
 * @param {IKV<unknown>[]} data
 * @param {string} pk
 * @returns {any}
 */
export function formatUpdate(
  db: string,
  table: string,
  tableDesc: IKV<string>[],
  newDataList: IKV<string>[],
  oldData?: IKV<string>,
) {
  let pk = queryPriOrUni(tableDesc)
  let c = oldData ? generateWhereCondition(tableDesc, oldData!, pk) : ''
  let sqlList: string[] = newDataList.map((item) => {
    let arr = tableDesc.map((k) => {
      return '`' + k.Field + '`=' + undefinedToValue(item[k.Field], k)
    })
    c = c || generateWhereCondition(tableDesc, item, pk)
    return `UPDATE  \`${db}\`.\`${table}\` SET ${arr.join(',')} WHERE ${c} LIMIT 1;`
  })

  return sqlList.join('\n')
}

function isEqual(v1: unknown, v2: unknown) {
  if (isObject(v1) && isObject(v2) && JSON.stringify(v1) === JSON.stringify(v2)) {
    return true
  }

  if (Array.isArray(v1) && Array.isArray(v2) && JSON.stringify(v1) === JSON.stringify(v2)) {
    return true
  }

  if (v1 === v2) {
    return true
  }

  if ([undefined, null, ''].includes(v1 as null) && v2 === null) {
    return true
  }

  if ([undefined, null, ''].includes(v2 as null) && v1 === null) {
    return true
  }
  return false
}

/**
 * 生成数据有更新过的 update sql 语句
 * @param {string} db
 * @param {string} table
 * @param {string[]} colums
 * @param {IKV<unknown>[]} data
 * @param {string} pk
 * @returns {any}
 */
export function formatUpdateValid(
  db: string,
  table: string,
  tableDesc: any[],
  newDataList:  IKV<string>[],
  oldData?: IKV<string>,
) {
  let pk = queryPriOrUni(tableDesc)
  let c = oldData ? generateWhereCondition(tableDesc, oldData!, pk) : ''
  let sqlList: string[] = []
  for (const newValue of newDataList) {
    const updateValueList = []
    for (const colDesc of tableDesc) {
      const fieldName = colDesc?.Field
      if (isEqual(oldData?.[fieldName], newValue[fieldName])) {
        continue
      }
      updateValueList.push('`' + fieldName + '`=' + undefinedToValue(newValue[fieldName], colDesc))
    }

    if (isEmptyArray(updateValueList)) {
      continue
    }

    c = c || generateWhereCondition(tableDesc, newValue, pk)

    const updateSql = `UPDATE  \`${db}\`.\`${table}\` SET ${updateValueList.join(',')} WHERE ${c} LIMIT 1;`

    sqlList.push(updateSql)
  }

  if (isEmptyArray(sqlList)) {
    return ''
  }

  return sqlList.join('\n')
}

/**
 * 查询表的主键或唯一键
 *
 * @param tableFieldList 表的字段信息
 * @returns
 */
export function queryPriOrUni(tableFieldList: IKV<string>[]) {
  let index = tableFieldList.findIndex((item) => item?.Key === 'PRI')

  if (index >= 0) {
    return {
      ...tableFieldList[index],
    }
  }

  index = tableFieldList.findIndex((item) => item?.Key === 'UNI')

  if (index >= 0) {
    return {
      ...tableFieldList[index],
    }
  }

  return null
}

/**
 *  生成 where 子句条件
 * @param tableDesc 表字段描述
 * @param dataItem 单条当前表数据
 * @returns
 */
export function generateWhereCondition(
  tableDesc: IKV<string>[],
  dataItem: IKV<string>,
  primaryOrUniqueKeyDesc?: IKV<string> | null,
) {
  const pk = primaryOrUniqueKeyDesc || queryPriOrUni(tableDesc)

  // 生成没有主键或者唯一键的条件
  const generateNotPK = (tableDesc: IKV<string>[], item: IKV<string>): string => {
    let str = ''
    tableDesc.forEach((field: IKV<string>, index: number) => {
      if (index > 0) {
        str += ' AND '
      }

      if (!isEmpty(item[field.Field])) {
        str += '`' + field.Field + "`='" + item[field.Field] + "'"
      } else {
        str += '`' + field.Field + '` IS NULL'
      }
    })
    return str
  }

  if (pk) {
    return '`' + pk.Field + "`='" + dataItem[pk.Field] + "'"
  } else {
    return generateNotPK(tableDesc, dataItem)
  }
}

/**
 * 判断是否是json 字符串
 * @param str 字符串
 * @returns json 对象 or false
 */

export function isJsonStr(str: unknown): unknown {
  if (!str || typeof str !== 'string') {
    return false
  }
  try {
    const result = JSON.parse(str)
    if (typeof result === 'object') {
      return result
    }
    return false
  } catch (error) {
    return false
  }
}

/**
 *  格式化 json str
 * @param json string
 * @returns
 */

export function JSONFormat(json: string) {
  if (!isJsonStr(json)) {
    return ''
  }

  let p: any = []

  const push = function (m: unknown) {
    return '\\' + p.push(m) + '\\'
  }
  const pop = function (_m: any, i: number) {
    return p[i - 1]
  }
  const tabs = function (count: number) {
    return new Array(count + 1).join('\t')
  }

  let out: any = ''
  let indent: any = 0

  // eslint-disable-next-line no-param-reassign
  json = json
    .replace(/\\./g, push)
    .replace(/(".*?"|'.*?')/g, push)
    .replace(/\s+/, '')

  // Indent and insert newlines
  for (let i = 0; i < json.length; i++) {
    let c = json.charAt(i)

    switch (c) {
      case '{':
      case '[':
        out += c + '\n' + tabs(++indent)
        break
      case '}':
      case ']':
        out += '\n' + tabs(--indent) + c
        break
      case ',':
        out += ',\n' + tabs(indent)
        break
      case ':':
        out += ': '
        break
      default:
        out += c
        break
    }
  }

  // Strip whitespace from numeric arrays and put backslashes
  // and strings back in
  out = out
    .replace(/\[[\d,\s]+?\]/g, (m: string) => {
      return m.replace(/\s/g, '')
    })
    .replace(/\\(\d+)\\/g, pop) // strings
    .replace(/\\(\d+)\\/g, pop) // backslashes in strings

  return out
}
