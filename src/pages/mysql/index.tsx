import DbTableTree from '@/components/DbTableTree/index'
import { deleteDelete, listConnect } from '@/service/dbInstance'
import {
  mysqlDbQuery,
  mysqlDelete,
  mysqlList,
  mysqlTableDataQuery,
  mysqlTableExecQuery,
  mysqlTableQuery,
} from '@/service/mysql'
import { mySqlState } from '@/store'
import { isEmptyArray } from '@/utils/utils'
import DbConnectList from '_cp/DbConnectList'
import { useBoolean } from 'ahooks'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import MySqlAddModal from './components/AddModal'
import CodeEdit from './components/CodeEdit'
import TableView from './components/TableView'
import style from './index.module.less'
import { common, mysql } from '@/types'
import { useStateRef, useAsyncLoading } from '@/hooks'

const Mysql: React.FC<any> = () => {
  const [connectList, setConnectList] = useState<mysql.dbList[]>()
  const [dbList, setDbList] = useState<any[]>()
  const [tableData, setTableData] = useState<any[]>([])
  const [addVisible, { toggle: addDbToggle }] = useBoolean(false)
  const [editInfo, setEditInfo] = useState<Partial<common.cuid>>()
  const [treeSelectedKeys, setTreeSelectedKeys] = useState<string[]>()

  const [mySqlDbStates, setMySqlDbStates] = useRecoilState(mySqlState.mySqlDbState)
  const [columns, setColumns] = useRecoilState(mySqlState.mySqlDbTableColumnsState)
  const [uuid, setUuid] = useRecoilState(mySqlState.mySqlDbUUid)
  const mySqlDbStatesRef = useStateRef(mySqlDbStates)
  useEffect(() => {
    initData()
  }, [])

  const initData = async () => {
    handleListConnect()
  }

  const handleChangeConnect = useAsyncLoading(async (uuid: common.uuid) => {
    let d: any = await mysqlDbQuery(uuid)
    setUuid(uuid)
    setDbList(d)
  })

  const handleListConnect = async () => {
    let dbList = await mysqlList()
    setConnectList(dbList)
  }

  const handleTreeSelect = useAsyncLoading(async (keys: unknown[], optopn: any) => {
    if (isEmptyArray(keys)) return
    setTreeSelectedKeys(keys as string[])
    let key = (keys[0] as string).split('.')
    if (key.length === 1) {
      let index = Number(key[0])
      let db = dbList![index]['name']
      let d = await mysqlTableQuery(uuid, db)
      if (index > -1) {
        let list = [...dbList!]
        list[index]['list'] = d
        setDbList(list)
      }
      setMySqlDbStates((s) => ({ ...s, dbName: db }))
    }

    if (key.length === 2) {
      let index = Number(key[0])
      let tableList = dbList![index]['list']
      let table = tableList[Number(key[1])]['name']
      let db = dbList![index]['name']

      let data = await mysqlTableDataQuery(uuid, db, table, {
        limit: mySqlDbStates.limit,
        offset: mySqlDbStates.offset,
      })
      setMySqlDbStates((s) => ({ ...s, dbName: db, tableName: table }))
      setColumns(data.columns)
      setTableData(data.list)
    }
  })

  // refresh table data
  const handleRefreshTable = useAsyncLoading(async () => {
    let data = await mysqlTableDataQuery(uuid, mySqlDbStatesRef.current.dbName!, mySqlDbStatesRef.current.tableName!, {
      limit: mySqlDbStatesRef.current.limit,
      offset: mySqlDbStatesRef.current.offset,
    })
    setTableData(data.list)
  })

  const handleRunSql = useAsyncLoading(async (sqlList: mysql.queryItem[]) => {
    let data: any = await mysqlTableExecQuery(uuid, sqlList)
    setColumns(data.columns)
    setTableData(data.list)
  })

  /*  connect start */
  const MySqlConnectDelete = (uuid: common.uuid) => {
    mysqlDelete({ uuid: uuid }).then(() => {
      handleListConnect()
    })
  }

  const MySqlConnectEdit = (item: common.cuid) => {
    setEditInfo(item)
  }

  const MySqlConnectAdd = async () => {
    addDbToggle(true)
    setEditInfo({})
  }
  /*  connect end */

  /*  add start */
  const handleAddOk = () => {
    handleListConnect()
  }

  const handleAddCancel = () => {
    addDbToggle(false)
  }
  /*  add end */

  return (
    <section className={style.mysql}>
      <div className="db-connect-wrap">
        <DbConnectList
          list={connectList}
          onAdd={MySqlConnectAdd}
          onDelete={MySqlConnectDelete}
          onChange={handleChangeConnect}
          onEdit={(data) => {
            setEditInfo(data)
            addDbToggle(true)
          }}
        />
      </div>
      <div className="db-data-wrap">
        <div className="db-table">
          <DbTableTree
            list={dbList!}
            config={{
              onSelect: handleTreeSelect,
              selectedKeys: treeSelectedKeys,
            }}
          />
        </div>

        <div className="db-transaction">
          <div className="db-transaction-tool">
            <div className="db-transaction-sql">
              <CodeEdit db={mySqlDbStatesRef.current.dbName!} onRun={handleRunSql} />
            </div>
          </div>

          <div className="db-transaction-view">
            <TableView
              columns={columns}
              dataSource={tableData}
              scroll={{ y: 300, x: '100vw' }}
              queryData={handleRefreshTable}
            />
          </div>
        </div>
      </div>
      {addVisible && (
        <MySqlAddModal visible={addVisible} onOk={handleAddOk} onCancel={handleAddCancel} initInfo={editInfo || {}} />
      )}
    </section>
  )
}

export default Mysql
