import { redisDeleteKey, redisRenameKey } from '@/service/redis'
import { redisDbUUidState } from '@/store/redis'
import { RedisKeyType } from '@/types/redisType'
import { CheckOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Col, Input, message, Modal, Row } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import styles from './index.module.less'
import { successMsg } from '@/utils/tips'

interface KeyTypeViewProps {
  keyValue: string
  KeyType: string
  onSave?: () => void
  onRefresh: () => void
  onRefreshKeyValue?: () => void
}
const KeyTypeView: React.FC<KeyTypeViewProps> = ({ keyValue, KeyType, onRefresh, onRefreshKeyValue, onSave }) => {
  const [value, setValue] = useState(keyValue)
  const [redisDbUUid, setRedisDbUUid] = useRecoilState(redisDbUUidState)

  useEffect(() => {
    setValue(keyValue)
  }, [keyValue])

  const type = useMemo(() => {
    return {
      set: 'Set',
      zset: 'ZSet',
      list: 'List',
      string: 'String',
      hash: 'Hash',
    }[KeyType]
  }, [KeyType])

  const handleDelete = () => {
    Modal.confirm({
      title: '删除！',
      content: (
        <span>
          确认删除【<span style={{ color: 'red' }}>{keyValue}</span>】？
        </span>
      ),
      onOk: async () => {
        try {
          await redisDeleteKey(redisDbUUid, keyValue)
          message.success('删除成功')
          onRefresh?.()
        } catch (error) {
          message.error(error as string)
        }
      },
    })
  }

  const handleSaveKey = () => {
    if (keyValue === value) return
    Modal.confirm({
      title: '更新键！',
      content: (
        <span>
          确认将<span style={{ color: 'red' }}> {keyValue} </span>改为<span style={{ color: 'red' }}> {value} </span>？
        </span>
      ),
      onOk: async () => {
        try {
          const res = await redisRenameKey(redisDbUUid, {
            key: keyValue,
            newKey: value,
          })
          successMsg()
          onRefresh?.()
        } catch (error) {
          message.error(error as string)
        }
      },
    })
  }
  return (
    <Row className={styles.KeyTypeView}>
      <Col span={8}>
        <Input
          addonBefore={type}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          value={value}
          suffix={<CheckOutlined className="cursor-p input-btn hover-scale" onClick={handleSaveKey} />}
        />
      </Col>
      <Col span={8}>
        <Button className="ml10" icon={<DeleteOutlined />} title="删除" danger onClick={handleDelete} />
        <Button
          className="ml10"
          icon={<SyncOutlined />}
          type="primary"
          ghost
          title="刷新"
          onClick={onRefreshKeyValue}
        />
      </Col>
    </Row>
  )
}
export default KeyTypeView
