import { RedisKeyType } from '@/types/redisType'
import { PlusOutlined } from '@ant-design/icons'
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form'
import { Button, Modal } from 'antd'
import React from 'react'
interface NewKeyModalProps {}
const NewKeyModal: React.FC<NewKeyModalProps> = () => {
  return (
    <ModalForm<{
      keyName: string
      keyType: string
    }>
      width={600}
      layout="horizontal"
      title="New Key"
      trigger={
        <Button>
          <PlusOutlined />
          New Key
        </Button>
      }
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onFinish={async (values) => {
        console.log(values.name)
        return true
      }}
    >
      <ProFormText name="keyName" label="Key Name" placeholder="请输入键名" />
      <ProFormSelect
        name="keyType"
        label="Key Type"
        request={async () => Object.keys(RedisKeyType).map((k) => ({ label: k, value: (RedisKeyType as any)[k] }))}
      />
    </ModalForm>
  )
}
export default NewKeyModal
