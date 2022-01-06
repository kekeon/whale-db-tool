import { Modal, Form, Input } from 'antd'
import React from 'react'

const Item = Form.Item
interface EditModalProps {
  visible: boolean
}
const EditModal: React.FC<EditModalProps> = ({ visible }) => {
  const handleOk = () => {}
  const handleCancel = () => {}
  return (
    <Modal title="Edit Line" width={800} visible={visible} onOk={handleOk} onCancel={handleCancel}>
      <Form layout="vertical">
        <Item label="Field">
          <Input />
        </Item>

        <Item label="Value">
          <Input />
        </Item>
      </Form>
    </Modal>
  )
}
export default EditModal
