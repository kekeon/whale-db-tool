import { ConnectedEnum } from '@/constant/js'
import { useAsyncVisible, useConnectedList, useStateRef } from '@/hooks'
import {
  redisDbNumber,
  redisKeyMemberRemove,
  redisKeysCmd,
  redisKeySet,
  redisKeyValue,
  redisSelectDb,
} from '@/service/redis'
import { redisDbUUidState } from '@/store/redis'
import { RedisKeyType } from '@/types/redisType'
import { Col, Input, message, Modal, Row, Select } from 'antd'
import classNames from 'classnames'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import DbConnectList from '_cp/DbConnectList'
import DBEditConnectModal from '_cp/DBEditConnectModal'
import TableView from './components/TableView'
import KeyTypeView from './components/KeyTypeView'
import StringView from './components/StringView'
import style from './index.module.less'
import NewKeyModal from './components/NewKeyModal'
import EditModal, { IEditModalForm } from './components/EditValueModal'
import { errorMsg, successMsg, warnMsg } from '@/utils/tips'
import { DbContainer } from '_cp/index'

const Option = Select.Option

interface RedisPageProps {
  to: string
}

interface IEditKeyValueType {
  member?: string
  keyInValue?: string
  value?: string
  index?: number
}

interface ITableDataColumn extends IEditKeyValueType {
  idx?: number
  score?: string
}

const Redis: React.FC<RedisPageProps> = () => {
  const [keyList, setKeyList] = useState<string[]>([])
  const [dbNumber, setDbNumber] = useState(1)
  const [selectDb, setSelectDb] = useState(0)
  const [selectKey, setSelectKey] = useState('')
  const [selectKeyInValue, setSelectKeyInValue] = useState('')
  const [selectKeyInType, setSelectKeyInType] = useState<RedisKeyType>()
  const [redisDbUUid, setRedisDbUUid] = useRecoilState(redisDbUUidState)
  const [showValueModal, setShowValueModal] = useState(false)
  const [isValueModalNew, setIsValueModalNew] = useState(false)
  const [editKeyValue, setEditKeyValue] = useState<IEditKeyValueType>()
  const editKeyValueRef = useStateRef<IEditKeyValueType | undefined>(editKeyValue)
  const redisDbUUidRef = useRef('')
  const redisKeyCursorRef = useRef(0)
  const initData = () => {}

  const getDbNumber = async (uuid: string) => {
    const res = await redisDbNumber(uuid)
    setDbNumber(Number(res))
  }

  const getDbKeys = async (count = 500, matchKey = '*') => {
    const res = await redisKeysCmd(redisDbUUidRef.current, {
      start: redisKeyCursorRef.current,
      count: count,
      matchKey: matchKey,
    })
    setKeyList(res.keys as string[])
    redisKeyCursorRef.current = Number(res?.cursor)
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
    // ???????????????
    redisDbUUidRef.current = uuid
    setRedisDbUUid(uuid)
    getDbNumber(uuid)
    getDbKeys()
  }
  const handleAddOk = () => {}
  const handleAddCancel = () => {
    handleConnectedFormVisible(false)
    // getDbKeys()
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
    await getDbKeys()
  }

  const handleSelectKey = async (v: string) => {
    setSelectKey(v)
    const res = await redisKeyValue(redisDbUUidRef.current, v)
    if (Array.isArray(res?.data) && res?.data.length) {
      setSelectKeyInValue(res?.data[0]?.data?.value as string)
      setSelectKeyInType(res?.data[0]?.data?.type)
    }
  }

  const handleSaveKeyInValue = async (v: string) => {
    const res = await redisKeySet({
      key: selectKey,
      uuid: redisDbUUid,
      key_type: selectKeyInType as RedisKeyType,
      value: v,
      line_key: '',
    })

    if (res?.data?.err_msg) {
      message.error(res?.data?.err_msg)
      return
    }

    if (res?.data?.data?.value === 'OK') {
      message.success('????????????')
      return
    }
  }

  const handleChangeKeySave = () => {}

  const handleEditValue = (row: IEditKeyValueType) => {
    setEditKeyValue({
      ...row,
      member: String((row as IEditKeyValueType).index),
    })
    setIsValueModalNew(false)
    setShowValueModal(true)
  }

  const { action: handleEditOk, visible: editSaveLoading } = useAsyncVisible(async (editValue) => {
    const formData = editValue as IEditModalForm
    if (!formData.field && !(formData as IEditModalForm).value) {
      warnMsg('?????????????????????????????????')
      return
    }

    if (selectKeyInType === RedisKeyType.SET && editKeyValueRef?.current?.value === formData?.value) {
      warnMsg('????????????????????????')
      return
    }

    const value = []
    if (formData?.field) {
      value.push(formData?.field)
    }

    if (formData?.value) {
      value.push(formData?.value)
    }

    const res = await redisKeySet({
      uuid: redisDbUUid,
      key_type: selectKeyInType as RedisKeyType,
      key: selectKey,
      line_key: [RedisKeyType.SET, RedisKeyType.ZSET].includes(selectKeyInType as RedisKeyType)
        ? editKeyValueRef?.current?.value
        : (editKeyValueRef?.current?.member as string),
      value: value,
    })

    if (res?.data?.err_msg) {
      errorMsg(res?.data?.err_msg)
      return
    }
    setEditKeyValue({ member: '' })
    successMsg()
    handleEditCancel()
    handleSelectKey(selectKey)
  })

  // ????????????
  const handleRemove = (row: IEditKeyValueType) => {
    const member = [RedisKeyType.HASH].includes(selectKeyInType as RedisKeyType)
      ? row?.keyInValue
      : (row?.value as string)

    Modal.confirm({
      title: '?????????',
      content: (
        <span>
          ?????????????????????<span style={{ color: 'red' }}>{member}</span>??????
        </span>
      ),
      onOk: async () => {
        const res = await redisKeyMemberRemove({
          uuid: redisDbUUid,
          key: selectKey,
          member: member!,
        })

        if (!res) {
          return
        }

        successMsg()
        handleSelectKey(selectKey)
      },
    })
  }

  const handleEditCancel = () => {
    setShowValueModal(false)
  }

  const handleAddMember = () => {
    setIsValueModalNew(true)
    setShowValueModal(true)
  }

  const handleKeywordSearch = async (keyword: string, type: string) => {
    const res = await redisKeyValue(redisDbUUidRef.current, selectKey, { match: keyword ?? `*${keyword}*` })
    if (Array.isArray(res?.data) && res?.data.length) {
      setSelectKeyInValue(res?.data[0]?.data?.value as string)
      setSelectKeyInType(res?.data[0]?.data?.type)
    }
  }

  const renderView = useCallback(
    (type: RedisKeyType) => {
      switch (type) {
        case RedisKeyType.STRING:
          return <StringView onSave={handleSaveKeyInValue} value={selectKeyInValue} />
        case RedisKeyType.LIST:
        case RedisKeyType.SET: {
          let data: ITableDataColumn[] = []
          if (Array.isArray(selectKeyInValue)) {
            data = selectKeyInValue.map((v, index) => ({
              idx: index + 1,
              index: index,
              value: v,
            }))
          }
          return (
            <TableView<ITableDataColumn>
              onSearch={handleKeywordSearch}
              keyType={type}
              dataSource={data}
              onRemove={handleRemove}
              onEdit={handleEditValue}
              onAdd={handleAddMember}
            />
          )
        }
        case RedisKeyType.ZSET: {
          let data: ITableDataColumn[] = []
          if (Array.isArray(selectKeyInValue)) {
            data = selectKeyInValue.map((v, index) => ({
              idx: index + 1,
              index: index,
              value: v?.Member,
              score: v?.Score,
            }))
          }
          return (
            <TableView
              onSearch={handleKeywordSearch}
              onAdd={handleAddMember}
              keyType={type}
              dataSource={data}
              onRemove={handleRemove}
              onEdit={handleEditValue}
            />
          )
        }
        case RedisKeyType.HASH: {
          let data: ITableDataColumn[] = []
          if (Array.isArray(selectKeyInValue)) {
            let item: ITableDataColumn = {}
            for (let i = 0; i < selectKeyInValue.length; i++) {
              if (i % 2 === 0) {
                item = {
                  idx: i,
                  keyInValue: selectKeyInValue[i],
                  index: selectKeyInValue[i],
                }
              } else {
                item.value = selectKeyInValue[i]
                data.push(item)
              }
            }
          }
          return (
            <TableView<ITableDataColumn>
              onSearch={handleKeywordSearch}
              onAdd={handleAddMember}
              keyType={type}
              dataSource={data}
              onRemove={handleRemove}
              onEdit={handleEditValue}
            />
          )
        }
        default:
          break
      }
    },
    [selectKeyInValue, selectKeyInType],
  )

  const handleSearchKey = (val: string) => {
    getDbKeys(500, `*${val}*`)
  }

  return (
    <div className={style.redis}>
      <DbContainer radius="15px" className="db-connect-wrap">
        <DbConnectList
          list={connectList}
          onAdd={handleConnectAddForm}
          onDelete={handleConnectedDelete}
          onChange={handleChangeConnect}
          onEdit={handleConnectedEdit}
        />
      </DbContainer>
      <div className="db-data-wrap">
        <DbContainer radius="15px" className="db-table">
          <Row gutter={20}>
            <Col span={12}>
              <Select value={selectDb} style={{ width: '100%' }} onChange={handleDbChange}>
                {...dbListOption}
              </Select>
            </Col>
            <Col span={12}>
              <NewKeyModal uuid={redisDbUUid} onSuccess={getDbKeys} />
            </Col>
          </Row>
          <Input.Search className="db-keys-search db-input-after" onSearch={handleSearchKey} placeholder="????????????" />

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
        </DbContainer>
        <DbContainer radius="15px" className="db-data-value">
          <KeyTypeView
            onSave={handleChangeKeySave}
            KeyType={selectKeyInType!}
            keyValue={selectKey}
            onRefresh={getDbKeys}
            onRefreshKeyValue={() => handleSelectKey(selectKey)}
          />
          <div style={{ marginTop: '10px' }} className="db-data-content">
            {renderView(selectKeyInType!)}
          </div>
        </DbContainer>
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
      {showValueModal && (
        <EditModal
          isNew={isValueModalNew}
          keyType={selectKeyInType}
          onCancel={handleEditCancel}
          field={editKeyValue?.keyInValue}
          value={editKeyValue?.value}
          visible={showValueModal}
          loading={editSaveLoading}
          onOk={handleEditOk}
        />
      )}
    </div>
  )
}
export default Redis
