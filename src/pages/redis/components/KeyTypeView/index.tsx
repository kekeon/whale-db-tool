import { redisDeleteKey } from '@/service/redis'
import { redisDbUUidState } from '@/store/redis'
import { DeleteOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Col, Input, message, Modal, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import styles from './index.module.less'

interface KeyTypeViewProps {
  keyValue: string
  KeyType: string
  onRefresh: () => void
}
const KeyTypeView: React.FC<KeyTypeViewProps> = ({ keyValue, KeyType, onRefresh }) => {
  const [value, setValue] = useState(keyValue)
  const [redisDbUUid, setRedisDbUUid] = useRecoilState(redisDbUUidState)

  useEffect(() => {
    setValue(keyValue)
  }, [keyValue])

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
  return (
    <Row className={styles.KeyTypeView}>
      <Col span={8}>
        <Input
          addonBefore={KeyType}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          value={value}
        />
      </Col>
      <Col span={8}>
        <Button className="ml10" icon={<DeleteOutlined />} title="删除" danger onClick={handleDelete} />
        <Button className="ml10" icon={<SyncOutlined />} type="primary" ghost title="刷新" />
        <Button className="ml10" title="保存" type="primary" icon={<SaveOutlined />} />
      </Col>
    </Row>
  )
}
export default KeyTypeView
