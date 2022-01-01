import { ConnectedEnum } from '@/constant/js'
import { useConnectedList } from '@/hooks'
import { redisConfigCmd, redisDbNumber, redisKeysCmd, redisKeyValue, redisSelectDb } from '@/service/redis'
import { redisDbUUidState } from '@/store/redis'
import { RedisKeyType } from '@/types/redisType'
import { Button, Col, Row, Select } from 'antd'
import classNames from 'classnames'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import DbConnectList from '_cp/DbConnectList'
import DBEditConnectModal from '_cp/DBEditConnectModal'
import TableView from './components/TableView'
import KeyTypeView from './components/KeyTypeView'
import StringView from './components/StringView'
import style from './index.module.less'
import { PlusOutlined } from '@ant-design/icons'
import NewKeyModal from './components/NewKeyModal'

const Option = Select.Option

interface RedisPageProps {
  to: string
}
const Redis: React.FC<RedisPageProps> = () => {
  const [keyList, setKeyList] = useState<string[]>([])
  const [dbNumber, setDbNumber] = useState(1)
  const [selectDb, setSelectDb] = useState(0)
  const [selectKey, setSelectKey] = useState('')
  const [selectKeyInValue, setSelectKeyInValue] = useState('')
  const [selectKeyInType, setSelectKeyInType] = useState('')
  const [redisDbUUid, setRedisDbUUid] = useRecoilState(redisDbUUidState)
  const redisDbUUidRef = useRef('')
  const initData = () => {}

  const getDbNumber = async (uuid: string) => {
    const res = await redisDbNumber(uuid)
    setDbNumber(Number(res))
  }

  const getDbKeys = async () => {
    const res = await redisKeysCmd(redisDbUUidRef.current)
    setKeyList(res)
  }

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
  } = useConnectedList({ type: ConnectedEnum.REDIS })

  const handleChangeConnect = async (uuid: string) => {
    // 查询库数量
    redisDbUUidRef.current = uuid
    setRedisDbUUid(uuid)
    getDbNumber(uuid)
    getDbKeys(selectDb)
  }
  const handleAddOk = () => {}
  const handleAddCancel = () => {
    handleConnectedFormVisible(false)
    getDbKeys()
  }

  /*  connect end */

  const dbListOption = useMemo(() => {
    let dom = []
    for (let i = 0; i < dbNumber; i++) {
      dom.push(
        <Option key={i} value={i}>
          DB{i}
        </Option>,
      )
    }
    return dom
  }, [dbNumber])

  const handleDbChange = async (v: number) => {
    setSelectDb(v)
    await redisSelectDb(redisDbUUidRef.current, v)
    await getDbKeys(v)
    // handleDbChange(0)
  }

  const handleSelectKey = async (v: string) => {
    setSelectKey(v)
    const res = await redisKeyValue(redisDbUUidRef.current, v)
    console.log(res)
    if (Array.isArray(res?.data) && res?.data.length) {
      setSelectKeyInValue(res?.data[0]?.data?.value as string)
      setSelectKeyInType(res?.data[0]?.data?.type as string)
    }
  }

  const renderView = useCallback(
    (type: string) => {
      switch (type) {
        case RedisKeyType.STRING:
          return <StringView value={selectKeyInValue} />
        case RedisKeyType.LIST:
        case RedisKeyType.SET: {
          let data: any = []
          if (Array.isArray(selectKeyInValue)) {
            data = selectKeyInValue.map((v, index) => ({
              idx: index + 1,
              value: v,
            }))
          }
          return <TableView keyType={type} dataSource={data} />
        }
        case RedisKeyType.ZSET: {
          let data: any = []
          if (Array.isArray(selectKeyInValue)) {
            data = selectKeyInValue.map((v, index) => ({
              idx: index + 1,
              value: v?.Member,
              score: v?.Score,
            }))
          }
          return <TableView keyType={type} dataSource={data} />
        }
        case RedisKeyType.HASH: {
          let data: any = []
          if (Array.isArray(selectKeyInValue)) {
            let item: any = {}
            for (let i = 0; i < selectKeyInValue.length; i++) {
              if (i % 2 === 0) {
                item = {
                  idx: i,
                  keyInValue: selectKeyInValue[i],
                }
              } else {
                item.value = selectKeyInValue[i]
                data.push(item)
              }
            }
          }
          return <TableView keyType={type} dataSource={data} />
        }
        default:
          break
      }
    },
    [selectKeyInValue],
  )

  return (
    <section className={style.redis}>
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
          <Row gutter={20}>
            <Col span={12}>
              <Select value={selectDb} style={{ width: 120 }} onChange={handleDbChange}>
                {...dbListOption}
              </Select>
            </Col>
            <Col span={12}>
              <NewKeyModal uuid={redisDbUUid} />
            </Col>
          </Row>

          <div className="db-keys-list">
            {keyList.map((key, index) => (
              <div
                key={index}
                onClick={() => handleSelectKey(key)}
                className={classNames('db-keys-item', {
                  'select-active': selectKey === key,
                })}
              >
                {key}
              </div>
            ))}
          </div>
        </div>
        <div className="db-data-value">
          <KeyTypeView KeyType={selectKeyInType} keyValue={selectKey} onRefresh={getDbKeys} />
          {renderView(selectKeyInType)}
        </div>
      </div>

      {addVisible && (
        <DBEditConnectModal
          type={ConnectedEnum.REDIS}
          title="Redis"
          visible={addVisible}
          onOk={handleAddOk}
          onCancel={handleAddCancel}
          initInfo={editInfo || {}}
        />
      )}
    </section>
  )
}
export default Redis
