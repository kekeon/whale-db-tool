import DbTableTree from '@/components/DbTableTree/index'
import { mysqlDbQuery, mysqlTableDataQuery, mysqlTableExecQuery, mysqlTableQuery } from '@/service/mysql'
import { mySqlState } from '@/store'
import { isEmptyArray } from '@/utils/utils'
import DbConnectList from '_cp/DbConnectList'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import CodeEdit from './components/CodeEdit'
import TableView from './components/TableView'
import style from './index.module.less'
import { common, mysql } from '@/types'
import { useStateRef, useAsyncLoading, useConnectedList } from '@/hooks'
import { mySqlQueryType } from '@/store/mysql/types'
import { Alert, Button } from 'antd'
import classNames from 'classnames'
import { CloseOutlined } from '@ant-design/icons'
import { ConnectedEnum } from '@/constant/js'
import DBEditConnectModal from '_cp/DBEditConnectModal'

const Mysql: React.FC<any> = () => {
  const [dbList, setDbList] = useState<any[]>()
  const [tableData, setTableData] = useState<any[]>([])

  const [treeSelectedKeys, setTreeSelectedKeys] = useState<string[]>()

  const [mySqlQueryErrorState, setMySqlQueryErrorState] = useRecoilState(mySqlState.mySqlQueryErrorState)
  const setMySqlQueryTypeState = useSetRecoilState(mySqlState.mySqlQueryTypeState)
  const [mySqlDbStates, setMySqlDbStates] = useRecoilState(mySqlState.mySqlDbState)
  const [columns, setColumns] = useRecoilState(mySqlState.mySqlDbTableColumnsState)

  const [uuid, setUuid] = useRecoilState(mySqlState.mySqlDbUUid)
  const mySqlDbStatesRef = useStateRef(mySqlDbStates)
  useEffect(() => {
    initData()
  }, [])

  const initData = async () => {
    // TDDO.
    // handleListConnect()
  }

  const handleChangeConnect = useAsyncLoading(async (uuid: common.uuid) => {
    let d: any = await mysqlDbQuery(uuid)
    setUuid(uuid)
    setDbList(d)
  })

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
      setMySqlQueryTypeState(mySqlQueryType.SYSTEM)
    }
  })

  // refresh table data
  const handleRefreshTable = useAsyncLoading(async (where?: string) => {
    let data = await mysqlTableDataQuery(uuid, mySqlDbStatesRef.current.dbName!, mySqlDbStatesRef.current.tableName!, {
      limit: mySqlDbStatesRef.current.limit,
      offset: mySqlDbStatesRef.current.offset,
      where: where,
    })

    setTableData(data.list)
  })

  const handleRunSql = useAsyncLoading(async (sqlList: mysql.queryItem[]) => {
    let data: any = await mysqlTableExecQuery(uuid, sqlList)
    setColumns(data.columns)
    setTableData(data.list)
    setMySqlQueryErrorState(data?.errMsg)
  })

  /*  connect start */
  const {
    connectList,
    addVisible,
    editInfo,
    handleListConnect,
    handleConnectAddForm,
    handleConnectedEdit,
    handleConnectedDelete,
    handleConnectedFormVisible,
  } = useConnectedList({ type: ConnectedEnum.MYSQL })
  /*  connect end */

  /*  add start */
  const handleAddOk = () => {
    handleListConnect()
  }

  const handleAddCancel = () => {
    console.log('handleAddCancel')

    handleConnectedFormVisible(false)
  }
  /*  add end */

  /* 切换表、运行SQL 重置翻页等数据 */

  return (
    <section className={style.mysql}>
      <div className="db-connect-wrap">
        <DbConnectList
          list={connectList}
          onAdd={handleConnectAddForm}
          onDelete={handleConnectedDelete}
          onChange={handleChangeConnect}
          onEdit={handleConnectedEdit}
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
              className={classNames({
                'wrap-hide': mySqlQueryErrorState,
              })}
            />

            <div
              className={classNames('db-transaction-run-sql-info', {
                'wrap-hide': !mySqlQueryErrorState,
              })}
            >
              <Alert
                message="SQL 错误"
                description={
                  <>
                    <p>错误码：{mySqlQueryErrorState?.Number}</p>
                    <p>错误信息：{mySqlQueryErrorState?.Message}</p>
                  </>
                }
                type="error"
                showIcon
                action={
                  <Button
                    onClick={() => {
                      setMySqlQueryErrorState(null)
                    }}
                    type="text"
                    icon={<CloseOutlined />}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
      {addVisible && (
        <DBEditConnectModal
          type={ConnectedEnum.MYSQL}
          title="MySql"
          visible={addVisible}
          onOk={handleAddOk}
          onCancel={handleAddCancel}
          initInfo={editInfo || {}}
        />
      )}
    </section>
  )
}

export default Mysql
