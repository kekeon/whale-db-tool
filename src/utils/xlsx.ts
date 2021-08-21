import XLSX, { WorkBook } from 'xlsx'
import dayjs from 'dayjs'
export interface ExcelHeader extends IKV<unknown> {
  dataIndex: number
  title: string
}

/**
 * 导出为excel数据
 * @param { Array} headers           导出的表格标题
  格式：
  [
    {
      title: 'IP',               // 必选
      key: 'ip',                 // 必选
      exportable: false/true,    // 可选（默认空值, 不导出）
      width: 100,                // 可选
      render: (record, row) => { // 可选
        return `<span>${ record } 香儿</span> 测试`;
      }
    }
  ]
  render传参：render(v, row, index, exp) // exp为bool,设为true时将数组格式处理为用','隔开的字符串，render方法中需手动添加方法=>例如：render: (v, row, index, exp) => {if (exp) return v && v.length ? v.join(',')} : '--';
 * @param {*} data                    导出的表格数据源
 * @param {string} [fileName='file']  导出文件名称
 */

function getPosition(i: number) {
  let p = String.fromCharCode(65 + i)
  if (i > 25) {
    let f = String.fromCharCode(65 + i / 25 - 1)
    p = f + String.fromCharCode(65 + ((i % 25) - 1))
  }

  return p
}

export function exportExcel(headers: ExcelHeader[], data: IKV<unknown>[], fileName = 'data') {
  const formatDate = dayjs().format('YYYYMMDDhmmss')
  let filename = `${fileName}_${formatDate}.xlsx`
  const _headers = headers
    .map((item, i) => {
      let compiledTitle = item.title

      return {
        key: item.key || item.dataIndex,
        title: compiledTitle,
        position: getPosition(i) + 1,
      }
    })
    .reduce(
      (prev, next) =>
        Object.assign({}, prev, {
          [next.position]: { key: next.key, v: next.title },
        }),
      {},
    )
  // return
  let _data = {}
  if (data && data.length) {
    _data = data
      .map((col, i) =>
        headers.map((item, j) => {
          let compiledContent = col[item.dataIndex] || ''
          return {
            content: compiledContent,
            position: getPosition(j) + (i + 2),
          }
        }),
      )
      // 对刚才的结果进行降维处理（二维数组变成一维数组）
      .reduce((prev, next) => prev.concat(next))
      // 转换成 worksheet 需要的结构
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.content } }), {})
  }

  // 合并 headers 和 data
  const output = Object.assign({}, _headers, _data)
  // 获取所有单元格的位置
  const outputPos = Object.keys(output)
  // 计算出范围 ,["A1",..., "H2"]
  const ref: string = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`
  const colsWidth: IKV<unknown>[] = (headers || []).map((item) => ({
    wpx: item.width || 100,
  }))
  // 构建 workbook 对象
  const wb: WorkBook = {
    SheetNames: ['sheet'],
    Sheets: {
      sheet: Object.assign({}, output, {
        '!ref': ref,
        '!cols': colsWidth,
      }),
    },
  }
  // 导出 Excel
  XLSX.writeFile(wb, filename)
}

// 下载文本
export function downloadJson(content: string, suffix: string = 'text', fileName: string = 'data') {
  let filename = `${fileName}_${dayjs().format('YYYYMMDDhhmmss')}`
  let a = document.createElement('a')
  let blob: any = new Blob([content])
  a.download = filename + '.json'
  a.href = URL.createObjectURL(blob)
  a.click()
  URL.revokeObjectURL(blob)
}
