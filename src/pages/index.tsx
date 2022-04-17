import { systemLogin } from '@/service/system'
import { system } from '@/types'
import storage from '@/utils/storage'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import styles from './styles/index.module.less'
import LoginImg from '@/assets/img/img-01.webp'
import { useAsyncVisible } from '@/hooks'
import { useForm } from 'antd/lib/form/Form'
import { USER_ACCOUNT } from '@/constant/js/storageKey'
interface LoginForm extends system.Login {
  remember: boolean
}

const Login: React.FC<any> = () => {
  const history = useHistory()
  const { visible: loginVisible, action: loginAction } = useAsyncVisible(systemLogin)
  const handleSubmit = async (value: LoginForm) => {
    const res = await loginAction({ account: value.account, password: value.password })

    if (res?.data) {
      storage().setLocal('AUTH_TOKEN', res?.data.token)

      history.replace('/main/mysql')
    }
  }

  const [formRef] = useForm<LoginForm>()
  const handleFormChange = () => {
    const formValue = formRef.getFieldsValue()
    if (formValue.remember) {
      const {password, ...reset} = formValue
      storage().setLocal(USER_ACCOUNT, reset)
    } else {
      storage().removeLocal(USER_ACCOUNT)
    }
  }

  useEffect(() => {
    const userAccount = storage().getLocal<LoginForm>(USER_ACCOUNT)
    if (userAccount?.remember) {
      formRef.setFieldsValue(userAccount)      
    }
  }, [])

  return (
    <div className={styles['login']}>
      <div className="login-wrap-card">
        <div className="sys-logo">
          <img src={LoginImg} alt="" />
        </div>
        <div className="sys-form">
          <div className="sys-form-title">账 号 登 录</div>
          <Form<LoginForm>
            form={formRef}
            name="basic"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            onValuesChange={handleFormChange}
          >
            <Form.Item name="account" rules={[{ required: true, message: '请输入账号' }]}>
              <Input
                placeholder="请输入账号"
                disabled={loginVisible}
                prefix={<UserOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password
                disabled={loginVisible}
                placeholder="请输入密码"
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>记住账号?</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button loading={loginVisible} className="login-btn" type="primary" htmlType="submit">
                登 录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login
