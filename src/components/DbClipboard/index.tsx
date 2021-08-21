import React, { useRef } from 'react'
import ClipboardJS from 'clipboard'
import { useEffect } from 'react'
import { message } from 'antd'

type value = string
interface Props {
  value?: value
  textFun?: (el: Element) => value
}
type PropsExtra = Props

const DbClipboard: React.FC<PropsExtra> = ({ children, value, textFun }) => {
  const ref = useRef<HTMLSpanElement>()

  const success = () => {
    message.success('拷贝成功')
  }

  useEffect(() => {
    const clipboard = new ClipboardJS(ref.current as HTMLElement, {
      text: (el: Element) => {
        success()
        if (textFun) {
          return textFun(el)
        }
        return value || ''
      },
    })

    return () => {
      clipboard.destroy()
    }
  }, [])
  return <span ref={ref}>{children}</span>
}
export default DbClipboard
