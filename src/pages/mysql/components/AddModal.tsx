import {
  formLayout,
  inputPlaceholder,
  inputRequired,
} from "@/constant/js/form";
import { addConnect, updateConnect } from "@/service/dbInstance";
import { Modal, Form, Input, InputNumber } from "antd";
import React from "react";
interface Props {
  visible: boolean;
  initInfo: Partial<conmon.cuid>;
  onCancel: () => void;
  onOk: () => void;
}

type PropsExtra = Props;

const Item = Form.Item;

const MySqlAddModal: React.FC<PropsExtra> = (props) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(value => {
      console.log(value);

      if (props.initInfo?.uuid) {
        updateConnect(props.initInfo?.uuid, value).then(() => {
          props?.onCancel()
          props?.onOk()
        })
      } else {
        addConnect(value).then(() => {
          props?.onCancel()
          props?.onOk()
        })
      }
    }, error => {
      console.log('error', error);
    })
  }

  const handleCancel = () => {
    props?.onCancel()
  }

  
  const { initInfo } = props;

  return (
    <div className={"MySqlAddModal"}>
      <Modal
        title="MySql"
        visible={props.visible}
        okText="确认"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form {...formLayout} form={form} name="MySqlAddForm">
          <Item
            name="another_name"
            label="名称"
            initialValue={initInfo?.another_name}
            rules={[
              inputRequired,
              {
                type: 'string',
                max: 100,
                message: "最大长度100",
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
                message: "最大长度100",
              },
            ]}
          >
            <Input placeholder={inputPlaceholder} />
          </Item>

          <Item
            name="name"
            label="用户名"
            initialValue={initInfo?.name}
            rules={[
              inputRequired,
              {
                max: 1000,
                type: 'string',
                message: "最大长度1000",
              },
            ]}
          >
            <Input placeholder={inputPlaceholder}/>
          </Item>

          <Item
            name="password"
            label="密码"
            rules={[
              {
                ...inputRequired,
                required: !Boolean(initInfo?.uuid)
              },
              {
                max: 100,
                type: 'string',
                message: "最大长度100",
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
                message: "最大值65535",
              },
            ]}
          >
            <InputNumber style={{width: '100%'}} placeholder={inputPlaceholder} />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};
export default MySqlAddModal;
