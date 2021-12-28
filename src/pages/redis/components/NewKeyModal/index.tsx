import { redisKeySet } from '@/service/redis'
import { RedisKeyType } from '@/types/redisType'
import { PlusOutlined } from '@ant-design/icons'
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form'
import { Button, Modal } from 'antd'
import React from 'react'
interface NewKeyModalProps {
  uuid: string
}
interface NewKeyModalForm {
  keyName: string
  keyType: RedisKeyType
}

const NewKeyModal: React.FC<NewKeyModalProps> = ({ uuid }) => {
  const handleAdd = async (value: NewKeyModalForm) => {
    const res = await redisKeySet({
      uuid,
      key_type: value.keyType,
      key: value.keyName,
    })
  }
  return (
    <ModalForm<NewKeyModalForm>
      width={600}
      layout="horizontal"
      labelCol={{ span: 4 }}
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
        console.log(values)
        await handleAdd(values)
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
