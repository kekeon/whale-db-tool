import { mysql } from '@/types'
import { IKV } from '@/types/commonTypes'
import { isEmpty, isEmptyArray } from '@/utils/utils'
import { ProFormColumnsType } from '@ant-design/pro-form'

interface DataItem {
  name: string
  state: string
}
/**
 * 生成form json
 * @param fieldList
 * @returns
 */
export function generateEditJson(fieldList: mysql.tableColumsInfo[], editRowData?: any) {
  if (isEmptyArray(fieldList)) return

  let list: ProFormColumnsType<DataItem>[] = fieldList.map((item) => {
    let o: ProFormColumnsType<DataItem> = {
      title: item.Field,
      dataIndex: item.Field,
    }
    let type = item.Type.replace(/\(.+/g, '').toLocaleLowerCase()
    switch (type) {
      // 数字
      case mysql.TableFieldType.tinyint:
      case mysql.TableFieldType.int:
      case mysql.TableFieldType.smallint:
      case mysql.TableFieldType.mediumint:
      case mysql.TableFieldType.integer:
      case mysql.TableFieldType.bigint:
      case mysql.TableFieldType.float:
      case mysql.TableFieldType.double:
      case mysql.TableFieldType.real:
      case mysql.TableFieldType.decimal:
      case mysql.TableFieldType.numeric:
      case mysql.TableFieldType.bit:
        o.valueType = 'digit'
        break
      // 日期
      case mysql.TableFieldType.date:
        o.valueType = 'date'
        break
      case mysql.TableFieldType.time:
        o.valueType = 'time'
        break
      case mysql.TableFieldType.year:
        o.valueType = 'dateYear'
        break
      case mysql.TableFieldType.datetime:
      case mysql.TableFieldType.timestamp:
        o.valueType = 'dateTime'
        break
      // 字符串
      case mysql.TableFieldType.char:
      case mysql.TableFieldType.varchar:
      case mysql.TableFieldType.blob:
      case mysql.TableFieldType.text:
      case mysql.TableFieldType.longtext:
      case mysql.TableFieldType.longblob:
      case mysql.TableFieldType.mediumtext:
      case mysql.TableFieldType.mediumblob:
      case mysql.TableFieldType.binary:
      case mysql.TableFieldType.varbinary:
        o.valueType = 'textarea'
        break
      case mysql.TableFieldType.tinytext:
      case mysql.TableFieldType.tinyblob:
        o.valueType = 'text'
        break
      // boolean
      case mysql.TableFieldType.bool:
      case mysql.TableFieldType.boolean:
        o.valueType = 'switch'
        break
      // json
      case mysql.TableFieldType.json:
        o.valueType = 'jsonCode'
        break
      /*   case mysql.TableFieldType.binary:
      case mysql.TableFieldType.varbinary:
        o.valueType = 'jsonCode'
        break */
      case mysql.TableFieldType.set:
        {
          o.valueType = 'select'
          let setList: string[] = item.Type.replace(/set|\(|\)|\'/g, '').split(',')
          let valueEnumSet: any = {}
          setList.forEach((s: string) => {
            if (s) {
              valueEnumSet[s] = {
                text: s,
                status: s,
              }
            }
          })
          o.valueEnum = valueEnumSet
        }
        break
      case mysql.TableFieldType.enum:
        {
          o.valueType = 'select'
          let enumList: string[] = item.Type.replace(/enum|\(|\)|\'/g, '').split(',')
          let valueEnumEnum: any = {}
          enumList.forEach((s: string) => {
            if (s) {
              valueEnumEnum[s] = {
                text: s,
                status: s,
              }
            }
          })
          o.valueEnum = valueEnumEnum
        }
        break
    }

    if (item.Comment) {
      o.tooltip = item.Comment
      o.fieldProps = {
        placeholder: item.Comment || '请输入',
      }
    }

    if (editRowData && ![null, undefined].includes(editRowData[item.Field])) {
      o.initialValue = [null, ''].includes(editRowData[item.Field]) ? undefined : editRowData[item.Field]
    }
    return o
  })

  return list
}

export function tableRenderData(rowField: IKV<string>, val: any) {
  const type = rowField?.Type?.replace(/\(.+/g, '').toLocaleLowerCase()
  const vNull = '[ null ]'
  let value = val
  switch (type) {
    // 数字
    case mysql.TableFieldType.tinyint:
    case mysql.TableFieldType.int:
    case mysql.TableFieldType.smallint:
    case mysql.TableFieldType.mediumint:
    case mysql.TableFieldType.integer:
    case mysql.TableFieldType.bigint:
    case mysql.TableFieldType.float:
    case mysql.TableFieldType.double:
    case mysql.TableFieldType.real:
    case mysql.TableFieldType.decimal:
    case mysql.TableFieldType.numeric:
    case mysql.TableFieldType.bit:
      value = value === null ? vNull : value
      break
    // 日期
    case mysql.TableFieldType.date:
    case mysql.TableFieldType.time:
    case mysql.TableFieldType.year:
    case mysql.TableFieldType.datetime:
    case mysql.TableFieldType.timestamp:
      value = value === null ? vNull : value
      break
    // 字符串
    case mysql.TableFieldType.char:
    case mysql.TableFieldType.varchar:
    case mysql.TableFieldType.blob:
    case mysql.TableFieldType.text:
    case mysql.TableFieldType.longtext:
    case mysql.TableFieldType.longblob:
    case mysql.TableFieldType.mediumtext:
    case mysql.TableFieldType.mediumblob:
    case mysql.TableFieldType.binary:
    case mysql.TableFieldType.varbinary:
    case mysql.TableFieldType.tinytext:
    case mysql.TableFieldType.tinyblob:
      value = value === null ? vNull : value
      break
    // boolean
    case mysql.TableFieldType.bool:
    case mysql.TableFieldType.boolean:
      value = value === null ? vNull : value
      break
    // json
    case mysql.TableFieldType.json:
      value = value === null ? vNull : value
      break
    /*     case mysql.TableFieldType.binary:
    case mysql.TableFieldType.varbinary:
      value = value === null ? vNull : value
      break */
    case mysql.TableFieldType.set:
    case mysql.TableFieldType.enum:
      value = isEmpty(value) ? vNull : value
      break
    default:
      value = value === null ? vNull : value
  }

  return value
}
