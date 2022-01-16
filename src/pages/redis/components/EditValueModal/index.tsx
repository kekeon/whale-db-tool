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
  isNew?: boolean
  visible: boolean
  loading: boolean
  field?: string
  value?: string
  keyType?: RedisKeyType
  onCancel: () => void
  onOk: (data: IEditModalForm) => void
}
const EditModal: React.FC<IEditModalProps> = ({ keyType, visible, field, value, loading, isNew, onCancel, onOk }) => {
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
      title={isNew ? 'Add New Line' : 'Edit Line'}
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
            {RedisKeyType.HASH === keyType ? (
              <Input placeholder="请输入" />
            ) : (
              <InputNumber placeholder="请输入数字" className="edit-modal-input" />
            )}
          </Item>
        ) : null}

        <Item label="" name="value" className="string-view-form">
          <StringView label={<div className="string-value-label">Value</div>} value={value || ''} />
        </Item>
      </Form>
    </Modal>
  )
}
export default EditModal
