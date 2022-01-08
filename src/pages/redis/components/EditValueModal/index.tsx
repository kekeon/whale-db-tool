import { Modal, Form, Input } from 'antd'
import React from 'react'
import StringView from '../StringView'

const Item = Form.Item
interface EditModalProps {
  visible: boolean
  field?: string
  value?: string
  onCancel: () => void
}
const EditModal: React.FC<EditModalProps> = ({ visible, field, value, onCancel }) => {
  const handleOk = () => {}
  const handleCancel = () => {
    onCancel?.()
  }
  return (
    <Modal title="Edit Line" width={800} visible={visible} onOk={handleOk} onCancel={handleCancel}>
      <Form layout="vertical">
        <Item label="Field" initialValue={field}>
          <Input />
        </Item>

        <Item label="Value">
          <StringView value={value || ''} />
        </Item>
      </Form>
    </Modal>
  )
}
export default EditModal
