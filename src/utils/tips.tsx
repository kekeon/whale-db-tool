import { Button, message, notification } from 'antd'
import React from 'react'

export function confirmTips(msg = '系统繁忙') {
  const key = `open${Date.now()}`

  const btn: any = (
    <Button
      onClick={() => {
        notification.close('2121')
      }}
    >
      确定
    </Button>
  )

  notification.destroy()
  notification.warn({
    message: '温馨提示',
    description: msg,
    duration: 2,
    btn: btn,
    key: key,
  })
}

// 错误提示框
export function warnTipsDiag(msg = '系统繁忙') {
  notification.destroy()
  notification.warn({
    message: '温馨提示',
    description: msg,
  })
}

// 正确提示框
export function successTip(msg = '操作成功') {
  notification.destroy()
  notification.success({
    message: '温馨提示',
    description: msg,
    key: '',
  })
}

// 消息提示 废除message提示框,使用Notification
export function successMsg(msg = '操作成功') {
  message.success(msg)
}

export function warnMsg(msg = '操作失败') {
  message.warning(msg)
}

export function errorMsg(msg = '操作出错') {
  message.error(msg)
}

export function loadingMsg(msg = '加载中', delay = 0) {
  return message.loading(msg, delay)
}

export function unSelectMsg() {
  message.destroy('unSelectTips')
  message.warning({
    key: 'unSelectTips',
    content: '请先选中数据哦...',
  })
}
