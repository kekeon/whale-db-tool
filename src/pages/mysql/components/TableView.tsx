import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VariableSizeGrid as Grid } from 'react-window'
import ResizeObserver from 'rc-resize-observer'
import classNames from 'classnames'
import { Button, Checkbox, Col, Divider, InputNumber, message, Modal, Row, Table } from 'antd'
import style from './styles/TableView.module.less'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import {
  AppstoreAddOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  FilterOutlined,
  ProfileOutlined,
  SyncOutlined,
  TableOutlined,
} from '@ant-design/icons'
import DbLabelText from '_cp/DbLabelText'
import DbDropdownMenu, { MenuItem } from '_cp/DbDropdownMenu'
import {
  copyMenuList,
  copy_excel,
  copy_inset_sql,
  copy_json,
  copy_update_sql,
  exportMenuList,
  select_excel,
  select_inset_sql,
  select_json,
  select_update_sql,
} from './const'

import { tableRenderData } from '../const'
import { downloadJson, exportExcel } from '@/utils/xlsx'
import { formatInsert, formatUpdate, isJsonStr, JSONFormat } from '@/utils/utils'
import DbClipboard from '_cp/DbClipboard'
import EditRowForm from './EditRowForm'
import { useBoolean } from 'ahooks'
import { mysqlTableDeleteItem } from '@/service/mysql'
import { mySqlState } from '@/store'
import { useRecoilState, useRecoilValue } from 'recoil'
import { mysql } from '@/types'
import { DbRnd, DbJsonAce } from '_cp/index'
import { unSelectMsg } from '@/utils/tips'
import { useStateRef } from '@/hooks'

interface Props {
  queryData?: (...args: any) => void
}
type PropsExtra = Props & Parameters<typeof Table>[0]
const TableView: React.FC<PropsExtra> = (props) => {
  const { scroll, queryData, dataSource = [] } = props
  const [tableWidth, setTableWidth] = useState(0)
  const [editFormType, setEditFormType] = useState<mysql.EditFormType>(mysql.EditFormType.new)

  // 行列相关数据，存储索引，翻页记得清空
  const [selectKeysMap, setSelectKeysMap] = useState<any>({}) // 包含-1， 选择全部行
  const [selectRowIndex, setSelectRowIndex] = useState<number>(-1)
  const [selectColIndex, setSelectColIndex] = useState<number>(-1)
  const gridRef = useRef<any>()
  const propsRef = useStateRef<PropsExtra>(props)
  const selectKeysMapRef = useStateRef<any>(selectKeysMap)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [editRowData, setEditRowData] = useState<any>()

  const [{ dbName, tableName, offset, limit }, setMySqlDbStates] = useRecoilState(mySqlState.mySqlDbState)
  const columns = useRecoilValue(mySqlState.mySqlDbTableColumnsState)
  const uuid = useRecoilValue(mySqlState.mySqlDbUUid)

  const [jsonBtnDisable, setJsonBtnDisable] = useState<boolean>(true)
  const [cellJsonData, setCellJsonData] = useState<unknown>()

  let totalWidth = 0
  let unWidthCount = 0
  columns?.forEach((column) => {
    if (column.width) {
      totalWidth += column.width as number
    } else {
      unWidthCount++
    }
  })

  let mergedColumns = useMemo(() => {
    let columnList = columns!.map((column) => {
      if (column.width) {
        return column
      }

      let w = unWidthCount ? Math.floor((tableWidth - totalWidth) / unWidthCount) : 150

      return {
        ...column,
        width: w < 150 ? 150 : w,
      }
    })
    columnList.unshift({
      width: 30,
      dataIndex: '__checkbox__',
      title: '__checkbox__',
    })
    return columnList
  }, [columns])

  let isSelectAll = useMemo(() => {
    return selectKeysMap['-1']
  }, [selectKeysMap])

  const [connectObject] = useState<any>(() => {
    const obj = {}
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => null,
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft })
        }
      },
    })

    return obj
  })

  /* 右键菜单 start */

  const rightMenuHide = () => {
    if (menuRef.current && menuRef.current!.style) {
      menuRef.current!.style.top = -1000 + 'px'
      menuRef.current!.style.left = '0px'
    }
    setJsonBtnDisable(true)
  }

  useEffect(() => {
    if (gridRef.current?._outerRef) {
      gridRef.current._outerRef.oncontextmenu = (e: {
        preventDefault: () => void
        target: HTMLElement
        clientY: number
        clientX: number
      }) => {
        const target = e.target as HTMLElement
        const rowIndex = target?.dataset?.rowIndex
        const colIndex = target?.dataset?.colIndex
        const dataSource: any = propsRef.current?.dataSource
        if (rowIndex) {
          // 获取触发单元格的数据
          const rowIndexNumber = Number(rowIndex)
          const colIndexNumber = Number(colIndex) - 1
          setSelectRowIndex(rowIndexNumber)
          setSelectColIndex(colIndexNumber)
          const column: any = propsRef.current?.columns?.[colIndexNumber]
          const cellData = dataSource[rowIndexNumber]?.[column?.dataIndex]
          const cellJson = isJsonStr(cellData)

          if (cellJson) {
            setCellJsonData(JSONFormat(cellData))
            setJsonBtnDisable(false)
          } else {
            setJsonBtnDisable(true)
          }
          menuRef.current!.style.top = e.clientY + 5 + 'px'
          menuRef.current!.style.left = e.clientX + 5 + 'px'
          e.preventDefault()
          return
        }

        rightMenuHide()
      }
    }

    const rightClick = () => {
      rightMenuHide()
    }

    document.body.addEventListener('click', rightClick)
    return () => {
      window.oncontextmenu = null
      document.body.removeEventListener('click', rightClick)
    }
  }, [])

  /* 右键菜单 end */

  /*  显示 json start */
  const [jsonRndVisible, setJsonRndVisible] = useState(false)
  const handleShowJson = () => {
    setJsonRndVisible(true)
  }

  const handleJsonClose = () => {
    setJsonRndVisible(false)
  }
  /*  显示 json end */

  const [editRowVisible, { toggle: editRowToggle }] = useBoolean(false)

  const resetVirtualGrid = () => {
    gridRef?.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: false,
    })
  }
  useEffect(() => {
    resetVirtualGrid()
  }, [tableWidth, columns])

  const handChangeCheckbox = (e: CheckboxChangeEvent, rowIndex: number) => {
    let v = e.target.checked
    selectKeysMap[rowIndex] = v

    // 取消全选
    if (rowIndex === -1 && !v) {
      setSelectKeysMap({})
      return
    }

    // 全选中，取消其中一个
    if (selectKeysMap[-1] && rowIndex >= 0 && !v) {
      selectKeysMap[-1] = false
      let o: any = {}
      props.dataSource?.forEach((row, index) => {
        o[index] = true
      })

      o[rowIndex] = false
      setSelectKeysMap(o)
      return
    }

    setSelectKeysMap({ ...selectKeysMap })
  }

  const handleRowCell = (e: React.MouseEvent, rowIndex: number, colIndex: number, rowData: any) => {
    e.preventDefault()
    setSelectRowIndex(rowIndex)
  }

  const renderVirtualList: any = (rowData: object[], { scrollbarSize, ref, onScroll }: any): React.ReactNode => {
    ref.current = connectObject

    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index: number) => {
          const width = mergedColumns[index]['width']
          return width as number
        }}
        height={scroll!.y as number}
        rowCount={rowData.length}
        rowHeight={() => 30}
        width={tableWidth}
        onScroll={({ scrollLeft }: { scrollLeft: number }) => {
          onScroll({ scrollLeft })
        }}
      >
        {({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
          return columnIndex === 0 ? (
            <div
              style={style}
              className={classNames('virtual-table-cell', {
                'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
                'odd-row': rowIndex % 2 !== 0,
              })}
            >
              <Checkbox
                checked={isSelectAll || selectKeysMap[rowIndex]}
                onChange={(e) => {
                  handChangeCheckbox(e, rowIndex)
                }}
              />
            </div>
          ) : (
            <div
              className={classNames('virtual-table-cell', {
                'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
                'odd-row': rowIndex % 2 !== 0,
                'select-row-bg': selectRowIndex === rowIndex,
              })}
              data-col-index={columnIndex}
              data-row-index={rowIndex}
              style={style}
              onClick={(e) => {
                handleRowCell(e, rowIndex, columnIndex, rowData)
              }}
            >
              {tableRenderData(
                (mergedColumns as any)[columnIndex],
                (rowData[rowIndex] as any)[(mergedColumns as any)[columnIndex].dataIndex],
              )}
            </div>
          )
        }}
      </Grid>
    )
  }

  const renderHeader: any = (rowProps: any) => {
    return (
      <tr>
        {rowProps.children.map((c: any, index: number) => {
          if (index === 0) {
            return (
              <th className="ant-table-cell" key={index}>
                <Checkbox
                  checked={isSelectAll}
                  onChange={(e) => {
                    handChangeCheckbox(e, -1)
                  }}
                />
              </th>
            )
          }
          return c
        })}
      </tr>
    )
  }

  const getSelectData = () => {
    let data: any = []
    const selectKeysMapData = selectKeysMapRef.current
    if (selectKeysMapData['-1']) {
      data = propsRef.current.dataSource
      return data
    }

    if (selectKeysMapData && Object.keys(selectKeysMapData).length > 0) {
      data = propsRef.current.dataSource?.filter((item, index) => selectKeysMapData[index])
    }
    return data
  }

  const handleExport = (data: MenuItem) => {
    let list = getSelectData()
    if (!list?.length) {
      return unSelectMsg()
    }
    switch (data.id) {
      case select_excel:
        exportExcel(props.columns as any, list)
        break
      case select_json:
        downloadJson(JSON.stringify(list), 'json')
        break
      case select_inset_sql:
        downloadJson(formatInsert(dbName!, tableName!, columns, list), 'json')
        break
      case select_update_sql:
        downloadJson(
          formatUpdate(
            dbName!,
            tableName!,
            (props as any).columns.map((d: any) => d.dataIndex),
            list,
          ),
          'json',
        )
        break
    }
  }

  const handleCopy = (item: MenuItem) => {
    let list = getSelectData()

    if (!list?.length) {
      return false
    }

    switch (item.idx) {
      case copy_excel:
        return copy_excel
      case copy_json:
        return JSON.stringify(list)
      case copy_inset_sql:
        return formatInsert(dbName!, tableName!, columns, list)
      case copy_update_sql:
        return formatUpdate(dbName!, tableName!, columns as any, list)
    }
  }

  const handleAddRow = () => {
    setEditRowData(undefined)
    setEditFormType(mysql.EditFormType.new)
    editRowToggle(true)
  }

  // 编辑行数据
  const handleEditRowForm = () => {
    const data = props.dataSource?.[selectRowIndex]
    setEditRowData(data)
    setEditFormType(mysql.EditFormType.edit)
    editRowToggle(true)
  }

  const copyMenuListMemo = useMemo(() => {
    return copyMenuList.map((item) => {
      item.title = (
        <DbClipboard
          textFun={() => {
            return handleCopy(item) as string
          }}
        >
          {item.title}
        </DbClipboard>
      )
      return item
    })
  }, [copyMenuList])

  /* 删除 start */
  const deleteTableData = (list: any[]) => {
    const len = list?.length
    Modal.confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: `确认删除选中的${len}条数据？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await mysqlTableDeleteItem({ dbName: dbName!, tableName: tableName!, uuid: uuid }, props.columns as any, list)
        setSelectKeysMap({})
        queryData?.()
        setSelectRowIndex(-1)
        message.success('删除成功')
      },
    })
  }

  const handleDeleteItems = async () => {
    const list = getSelectData()
    deleteTableData(list)
  }

  const handleDeleteItem = () => {
    const data = props.dataSource?.[selectRowIndex]
    deleteTableData([data])
  }

  /* 删除 end */

  const handleRowChange = (v) => {
    setMySqlDbStates((s) => ({
      ...s,
      limit: v || 1000,
    }))
  }

  const pageIndex = useMemo(() => {
    if (offset === 0 || limit === 0) {
      return 1
    }

    return Math.floor(offset! / limit!) + 1
  }, [limit, offset])

  const handleTurnPageUp = useCallback(() => {
    const offsetNum = offset! - limit!
    if (offsetNum < 0) {
      return
    }
    setMySqlDbStates((s) => ({
      ...s,
      offset: offsetNum,
    }))
  }, [[limit, offset]])

  const handleTurnPageDown = useCallback(() => {
    const offsetNum = offset! + limit!
    setMySqlDbStates((s) => ({
      ...s,
      offset: offsetNum,
    }))
  }, [[limit, offset]])

  return (
    <div className={style['table-view']}>
      <Row className="table-toolbar" justify="space-between" align="middle">
        <Col span={12}>
          <DbDropdownMenu list={exportMenuList} onClick={handleExport}>
            <Button title="导出" type="text" className="ml5" icon={<ExportOutlined />} />
          </DbDropdownMenu>
          <DbDropdownMenu list={copyMenuListMemo}>
            <Button title="复制" type="text" className="ml5" icon={<CopyOutlined />} />
          </DbDropdownMenu>
          <Button title="插入" type="text" className="ml5" onClick={handleAddRow} icon={<AppstoreAddOutlined />} />
          <Button title="删除" type="text" className="ml5" onClick={handleDeleteItems} icon={<DeleteOutlined />} />
          {/* <Button title="表格查看" type="text" className="ml5" icon={<TableOutlined />} />
          <Button title="表单查看" type="text" className="ml5" icon={<ProfileOutlined />} /> */}
        </Col>
        <Col span={12} className="left">
          <Row justify="end" align="middle">
            {/*             <Button type="text" className="ml5" icon={<FilterOutlined title="筛选" />} />
             */}{' '}
            <Button type="text" className="ml5" onClick={queryData} icon={<SyncOutlined title="刷新" />} />
            <DbLabelText text="页码">
              <Button
                type="text"
                onClick={handleTurnPageUp}
                disabled={pageIndex === 1}
                icon={<CaretLeftOutlined title="上一页" />}
              />
              <InputNumber size="small" min={0} value={pageIndex} />
              <Button
                type="text"
                onClick={handleTurnPageDown}
                disabled={dataSource?.length < limit! ? true : false}
                icon={<CaretRightOutlined title="下一页" />}
              />
            </DbLabelText>
            <DbLabelText text="行数">
              <InputNumber size="small" min={0} value={limit || 0} onChange={handleRowChange} />
            </DbLabelText>
          </Row>
        </Col>
      </Row>
      <ResizeObserver
        onResize={({ width }) => {
          setTableWidth(width)
        }}
      >
        <Table
          {...props}
          className="virtual-table"
          columns={mergedColumns}
          pagination={false}
          components={{
            header: {
              row: renderHeader,
            },
            body: renderVirtualList,
          }}
        />
      </ResizeObserver>
      {editRowVisible && (
        <EditRowForm
          visible={editRowVisible}
          toggle={editRowToggle}
          onSuccess={queryData}
          editData={editRowData}
          formType={editFormType}
        />
      )}
      {jsonRndVisible && (
        <DbRnd onClose={handleJsonClose}>
          <DbJsonAce readonly={true} data={cellJsonData} />
        </DbRnd>
      )}
      <div className="menu-wrap" ref={menuRef}>
        <div className="menu-btn" onClick={handleEditRowForm}>
          编辑
        </div>
        <div className="menu-btn" onClick={handleDeleteItem}>
          删除
        </div>
        <Divider className="btn-divider" />
        <div
          className={classNames('menu-btn', {
            'db-btn-disable': jsonBtnDisable,
          })}
          onClick={
            jsonBtnDisable
              ? (e) => {
                  e.stopPropagation()
                }
              : handleShowJson
          }
        >
          JSON显示
        </div>
      </div>
    </div>
  )
}
export default TableView
