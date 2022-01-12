import { RedisKeyType } from '@/types/redisType'
import { Modal, Form, Input, InputNumber } from 'antd'
import React, { useEffect } from 'react'
import StringView from '../StringView'
import style from './index.module.less'

export interface IEditModalForm {
  field?: string | number
  value?: string
}

const Item = Form.Item
interface IEditModalProps {
  visible: boolean
  loading: boolean
  field?: string
  value?: string
  keyType?: RedisKeyType
  onCancel: () => void
  onOk: (data: IEditModalForm) => void
}
const EditModal: React.FC<IEditModalProps> = ({ keyType, visible, field, value, onCancel, onOk, loading }) => {
  const [formRef] = Form.useForm()

  const handleOk = () => {
    const resData = formRef.getFieldsValue()
    console.log('resData', resData)

    onOk?.(resData)
  }
  const handleCancel = () => {
    onCancel?.()
  }

  useEffect(() => {
    if (visible) {
      formRef.setFieldsValue({ field: field, value: value })
    } else {
      formRef.resetFields()
    }
  }, [visible])

  return (
    <Modal
      title="Edit Line"
      width={800}
      visible={visible}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={handleCancel}
      className={style.editValueModal}
    >
      <Form<IEditModalForm> layout="vertical" form={formRef}>
        {[RedisKeyType.HASH, RedisKeyType.ZSET].includes(keyType) ? (
          <Item label="Field" name="field" initialValue={field}>
            {RedisKeyType.HASH === keyType ? <Input /> : <InputNumber />}
          </Item>
        ) : null}

        <Item label="Value" name="value" className="string-view-form">
          <StringView value={value || ''} />
        </Item>
      </Form>
    </Modal>
  )
}
export default EditModal
