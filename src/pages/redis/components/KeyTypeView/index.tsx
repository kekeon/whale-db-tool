import { DeleteOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.module.less'

interface KeyTypeViewProps {
  keyValue: string
  KeyType: string
}
const KeyTypeView: React.FC<KeyTypeViewProps> = ({ keyValue, KeyType }) => {
  const [value, setValue] = useState(keyValue)

  useEffect(() => {
    setValue(keyValue)
  }, [keyValue])
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
        <Button className="ml10" icon={<DeleteOutlined />} title="删除" danger />
        <Button className="ml10" icon={<SyncOutlined />} type="primary" ghost title="刷新" />
        <Button className="ml10" title="保存" type="primary" icon={<SaveOutlined />} />
      </Col>
    </Row>
  )
}
export default KeyTypeView
