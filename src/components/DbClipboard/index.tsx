import React, { useRef, useEffect } from 'react'
import ClipboardJS from 'clipboard'
import { message } from 'antd'
import { unSelectMsg } from '@/utils/tips'

type value = string
interface Props {
  value?: value
  textFun?: (el: Element) => value
}
type PropsExtra = Props

const DbClipboard: React.FC<PropsExtra> = ({ children, value, textFun }) => {
  const ref = useRef<HTMLSpanElement>(null)

  const success = () => {
    message.success('拷贝成功')
  }

  useEffect(() => {
    const clipboard = new ClipboardJS(ref.current as HTMLElement, {
      text: (el: Element) => {
        if (textFun) {
          if (!textFun(el)) {
            unSelectMsg()
            return ''
          }
          success()
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
