import { formLayout, inputPlaceholder, inputRequired } from '@/constant/js/form'
import { addConnect, updateConnect } from '@/service/dbInstance'
import { mysqlAdd, mysqlPing, mysqlUpdate } from '@/service/mysql'
import { common, mysql } from '@/types'
import { Modal, Form, Input, InputNumber, Button } from 'antd'
import React, { useState } from 'react'
interface Props {
  visible: boolean
  initInfo: Partial<common.cuid>
  onCancel: () => void
  onOk: () => void
}

type PropsExtra = Props

const Item = Form.Item

const MySqlAddModal: React.FC<PropsExtra> = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const handleOk = () => {
    form.validateFields().then(
      (value) => {
        console.log(value)
        setLoading(true)
        if (props.initInfo?.uuid) {
          mysqlUpdate({
            ...value,
            type: 'mysql',
            uuid: props.initInfo?.uuid || '',
          }).then(() => {
            setLoading(false)
            props?.onCancel()
            props?.onOk()
          })
        } else {
          mysqlAdd({ ...value, type: 'mysql' }).then(() => {
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
        console.log(value)

        const data: mysql.dbBase = {
          password: value.password,
          user: value.user,
          host: value.host,
          port: value.port,
        }
        const res = await mysqlPing(data)
        console.log('res', res)
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
        title="MySql"
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
                required: !initInfo?.uuid,
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
            initialValue={initInfo?.port || 3306}
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

          <Item name="" label="">
            <Button onClick={handlePing}>检测</Button>
          </Item>
        </Form>
      </Modal>
    </div>
  )
}
export default MySqlAddModal
