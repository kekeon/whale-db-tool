import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import ClipboardJS from 'clipboard'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'

interface Props {
  icon?: React.ReactChild
  text: any
  style?: React.CSSProperties
  className?: string
  copyIconProps?: React.HTMLAttributes<unknown>
  isIconColor?: boolean
  children?: React.ReactChild
}

type PropsExtra = Props
const DbClipboardNode: React.FC<PropsExtra> = ({
  copyIconProps,
  icon,
  text,
  style,
  className,
  isIconColor = true,
  children,
}) => {
  const CopyIcon = icon ? icon : <CopyOutlined {...copyIconProps} />
  const [isCopySuccess, setIsCopySuccess] = useState<boolean>(false)
  const timerRef = useRef<number>()
  const isCopySuccessRef = useRef<boolean>()
  const $spanRef = useRef<HTMLSpanElement>(null)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCopySuccessRef.current) {
      return
    }
    setIsCopySuccess(true)
    isCopySuccessRef.current = true
    timerRef.current = setTimeout(() => {
      setIsCopySuccess(false)
      isCopySuccessRef.current = false
    }, 3000)
  }

  useEffect(() => {
    const clipboard = new ClipboardJS($spanRef.current as HTMLElement, {
      text: (el: Element) => {
        return text || ''
      },
    })
    return () => {
      clearTimeout(timerRef.current)
      clipboard.destroy()
    }
  }, [])

  return (
    <span style={style} ref={$spanRef} className={classNames(styles.DbClipboardNode, className)}>
      <span
        className={classNames({
          DbClipboardNodeIconSuccess: isCopySuccess,
          DbClipboardNodeIcon: isIconColor,
        })}
        onClick={handleCopy}
      >
        {isCopySuccess ? <CheckOutlined /> : CopyIcon}
        {children}
      </span>
    </span>
  )
}
export default DbClipboardNode
