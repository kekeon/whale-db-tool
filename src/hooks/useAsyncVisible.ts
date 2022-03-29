import { message } from 'antd'
import { useRef, useState } from 'react'

const useAsyncVisible = <T>(asyncFunc: (...args: any) => T) => {
  const [visible, setVisible] = useState(false)
  const resRef = useRef<T | null>(null)

  const action = async (...args: unknown[]) => {
    setVisible(true)
    try {
      resRef.current = await asyncFunc(...args)
    } catch (error) {
      console.error(error)
      // message.warn('请求失败')
    }
    setVisible(false)
    return resRef.current
  }

  return {
    visible,
    action,
  }
}

export default useAsyncVisible
