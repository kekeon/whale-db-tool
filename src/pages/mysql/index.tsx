import DbTableTree from "@/components/DbTableTree/index";
import { deleteDelete, listConnect } from "@/service/dbInstance";
import {
  mysqlDbQuery,
  mysqlTableColumnsShowFull,
  mysqlTableDataQuery,
  mysqlTableExecQuery,
  mysqlTableQuery,
} from "@/service/mysql";
import { mySqlState } from "@/store";
import { isEmptyArray } from "@/utils/utils";
import DbConnectList from "_cp/DbConnectList";
import { useBoolean } from "ahooks";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import MySqlAddModal from "./components/AddModal";
import CodeMonaco from "./components/CodeMonaco";
import TableView from "./components/TableView";
import style from "./index.module.less";

const Mysql: React.FC<any> = () => {
  const [connectList, setConnectList] = useState<any[]>();
  const [dbList, setDbList] = useState<any[]>();
  const [tableData, setTableData] = useState<any[]>([]);
  const [addVisible, { toggle: addDbtoggle }] = useBoolean(false);
  const [editInfo, setEditInfo] = useState<Partial<conmon.cuid>>();

  const [mySqlDbStates, setMySqlDbStates] = useRecoilState(mySqlState.mySqlDbState);
  const [columns, setColumns] = useRecoilState(mySqlState.mySqlDbTableColumsState);
  const [uuid, setUuid] = useRecoilState(mySqlState.mySqlDbUUid);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    handleListConnect();

    let d: any = await mysqlDbQuery(uuid);
    console.log("initData", d);
    setDbList(d);
  };

  const handleListConnect = async () => {
    let r = await listConnect();
    setConnectList(r);
  };

  const handleTreeSelect = async (keys: string[], optopn: any) => {
    console.log(keys, optopn);
    if (isEmptyArray(keys)) return;
    let key = keys[0].split("_");
    if (key.length === 1) {
      let index = Number(key[0]);
      let db = dbList![index]["name"];
      let d = await mysqlTableQuery(uuid, db);
      if (index > -1) {
        let list = [...dbList!];
        list[index]["list"] = d;
        setDbList(list);
      }
      setMySqlDbStates((s) => ({ ...s, dbName: db }));
    }

    if (key.length === 2) {
      let index = Number(key[0]);
      let tableList = dbList![index]["list"];
      let table = tableList[Number(key[1])]["name"];
      let db = dbList![index]["name"];
      let data = await mysqlTableDataQuery(uuid, dbList![index]["name"], table);
      setMySqlDbStates((s) => ({ ...s, dbName: db, tableName: table }));
      console.log("data", data);
      setColumns(data.columns);
      setTableData(data.list);
    }
  };

  // refresh table data
  const handleRefreshTable = async () => {
    let data = await mysqlTableDataQuery(
      uuid,
      mySqlDbStates.dbName!,
      mySqlDbStates.tableName!
    );
    setTableData(data.list);
  };

  const handleRunSql = async (sqlList: mysql.queryItem[]) => {
    let data: any = await mysqlTableExecQuery(uuid, sqlList);
    setColumns(data.columns);
    setTableData(data.list);
  };

  /*  connect start */
  const MySqlConnectDelete = (item: conmon.cuid) => {
    deleteDelete(item.uuid).then(() => {
      handleListConnect();
    });
  };

  const MySqlConnectEdit = (item: conmon.cuid) => {
    setEditInfo(item);
  };

  const MySqlConnectAdd = async () => {
    addDbtoggle(true);
    setEditInfo({});
  };
  /*  connect end */

  /*  add start */
  const handleAddOk = () => {
    handleListConnect();
  };

  const handleAddCancel = () => {
    addDbtoggle(false);
  };
  /*  add end */

  return (
    <section className={style.mysql}>
      <div className="db-connect-wrap">
        <DbConnectList
          onAdd={MySqlConnectAdd}
          onDelete={MySqlConnectDelete}
          onEdit={MySqlConnectEdit}
          list={connectList}
        />
      </div>
      <div className="db-data-wrap">
        <div className="db-table">
          <DbTableTree
            list={dbList}
            config={{
              onSelect: handleTreeSelect,
            }}
          />
        </div>

        <div className="db-transaction">
          <div className="db-transaction-tool">
            <div className="db-transaction-sql">
              <CodeMonaco db={mySqlDbStates.dbName!} onRun={handleRunSql} />
            </div>
          </div>

          <div className="db-transaction-view">
            <TableView
              columns={columns}
              dataSource={tableData}
              scroll={{ y: 300, x: "100vw" }}
              queryData={handleRefreshTable}
            />
          </div>
        </div>
      </div>
      {addVisible && (
        <MySqlAddModal
          visible={addVisible}
          onOk={handleAddOk}
          onCancel={handleAddCancel}
          initInfo={editInfo || {}}
        />
      )}
    </section>
  );
};

export default Mysql;
