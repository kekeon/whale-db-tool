import { ConnectedEnum } from '@/constant/js'
import { formLayout, inputPlaceholder, inputRequired } from '@/constant/js/form'
import { connectedAdd, connectedUpdate } from '@/service/connected'
import { mysqlPing } from '@/service/mysql'
import { redisPing } from '@/service/redis'
import { common, mysql } from '@/types'
import { Modal, Form, Input, InputNumber, Button, message } from 'antd'
import React, { useState } from 'react'
interface DBEditConnectModalProps {
  title: string
  type: ConnectedEnum
  visible: boolean
  initInfo: Partial<common.cuid>
  onCancel: () => void
  onOk: () => void
}

const Item = Form.Item

const DBEditConnectModal: React.FC<DBEditConnectModalProps> = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { type, title } = props

  const handleOk = () => {
    form.validateFields().then(
      (value) => {
        setLoading(true)
        if (props.initInfo?.uuid) {
          connectedUpdate({
            ...value,
            type: type,
            uuid: props.initInfo?.uuid || '',
          }).then(() => {
            setLoading(false)
            props?.onCancel()
            props?.onOk()
          })
        } else {
          connectedAdd({ ...value, type: type }).then(() => {
            setLoading(false)
            props?.onCancel()
            props?.onOk()
          })
        }
      },
      (error) => {
        console.log('error', error)
      },
    )
  }

  const handlePing = () => {
    form.validateFields().then(
      async (value) => {
        const data: mysql.dbBase = {
          password: value.password || '',
          user: value.user,
          host: value.host,
          port: value.port,
        }

        const pingFunc = type === ConnectedEnum.MYSQL ? mysqlPing : redisPing

        const res = await pingFunc(data)
        if (res) {
          message.success('连接成功')
        } else {
          message.warn('连接失败')
        }
      },
      (error) => {
        console.log('error', error)
      },
    )
  }

  const handleCancel = () => {
    props?.onCancel()
  }

  const { initInfo } = props

  return (
    <div className="MySqlAddModal">
      <Modal
        title={title}
        visible={props.visible}
        okText="确认"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          loading: loading,
        }}
      >
        <Form<mysql.dbBase> {...formLayout} form={form} name="MySqlAddForm">
          <Item
            name="another_name"
            label="名称"
            initialValue={initInfo?.another_name}
            rules={[
              inputRequired,
              {
                type: 'string',
                max: 100,
                message: '最大长度100',
              },
            ]}
          >
            <Input placeholder={inputPlaceholder} />
          </Item>

          <Item
            name="host"
            label="Host"
            initialValue={initInfo?.host}
            rules={[
              inputRequired,
              {
                max: 100,
                type: 'string',
                message: '最大长度100',
              },
            ]}
          >
            <Input placeholder={inputPlaceholder} />
          </Item>

          <Item
            name="user"
            label="用户名"
            initialValue={initInfo?.name}
            rules={[
              inputRequired,
              {
                max: 1000,
                type: 'string',
                message: '最大长度1000',
              },
            ]}
          >
            <Input placeholder={inputPlaceholder} />
          </Item>

          <Item
            name="password"
            label="密码"
            rules={[
              {
                ...inputRequired,
                required: false,
              },
              {
                max: 100,
                type: 'string',
                message: '最大长度100',
              },
            ]}
          >
            <Input type="password" placeholder={inputPlaceholder} />
          </Item>

          <Item
            name="port"
            label="端口"
            initialValue={initInfo?.port || type === ConnectedEnum.MYSQL ? 3306 : 6739}
            rules={[
              inputRequired,
              {
                max: 65535,
                type: 'number',
                message: '最大值65535',
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder={inputPlaceholder} />
          </Item>

          <Item name="" label="" wrapperCol={{ offset: 4 }}>
            <Button onClick={handlePing}>检测</Button>
          </Item>
        </Form>
      </Modal>
    </div>
  )
}
export default DBEditConnectModal
