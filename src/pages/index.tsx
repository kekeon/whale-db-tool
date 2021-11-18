import { systemLogin } from '@/service/system'
import { system } from '@/types'
import storage from '@/utils/storage'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import React from 'react'
import { useHistory } from 'react-router'
import styles from './styles/index.module.less'
import LoginImg from '@/assets/img/img-01.webp'
interface LoginForm extends system.Login {
  remember: boolean
}

const Login: React.FC<any> = () => {
  const history = useHistory()

  const handleSubmit = async (value: LoginForm) => {
    const res = await systemLogin({
      account: value.account,
      password: value.password,
    })

    storage().setLocal('AUTH_TOKEN', res.data.token)

    history.replace('/main/mysql')
  }

  return (
    <div className={styles['login']}>
      <div className="login-wrap-card">
        <div className="sys-logo">
          <img src={LoginImg} alt="" />
        </div>
        <div className="sys-form">
          <div className="sys-form-title">User Login</div>
          <Form<LoginForm>
            name="basic"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <Form.Item name="account" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input placeholder="Enter your username" prefix={<UserOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password
                placeholder="Enter your password"
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me ?</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button className="login-btn" type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login
