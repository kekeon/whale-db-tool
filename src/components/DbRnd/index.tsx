import { ArrowsAltOutlined, CloseOutlined, EditOutlined, ShrinkOutlined } from '@ant-design/icons'
import { useToggle } from 'ahooks'
import React, { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Rnd } from 'react-rnd'
import styles from './index.module.less'

interface positionStyle {
  width: number | string
  height: number | string
  x: number
  y: number
}

interface Props {
  onClose?: () => void
  extraHeader?: React.ReactNode
}
type PropsExtra = Props
const DbJonDock: React.FC<PropsExtra> = ({ onClose, extraHeader, ...resetProps }) => {
  const [value, { toggle: toggleFullScroll }] = useToggle(false)
  const [renderKey, setRenderKey] = useState(0)
  const positionStyleRef = useRef<positionStyle>()
  const [positionStyle, setPositionStyle] = useState<positionStyle>({
    x: 40,
    y: 40,
    width: 300,
    height: 400,
  })

  const handleClose = () => {
    onClose?.()
  }

  return createPortal(
    <Rnd
      className={styles.DbRnd}
      bounds="body"
      dragHandleClassName="DbRndHeader"
      size={{ width: positionStyle?.width, height: positionStyle?.height }}
      position={{ x: positionStyle.x, y: positionStyle.y }}
      onDragStop={(_e, d) => {
        setPositionStyle((s) => ({
          ...s,
          x: d.x,
          y: d.y,
        }))
      }}
      onResizeStop={(e, _direction, ref, _delta, position) => {
        setRenderKey(renderKey + 1)
        setPositionStyle((s) => ({
          ...s,
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        }))
      }}
    >
      <div className="DbRndWrap">
        <div className="DbRndHeader">
          <div className="DbRndHeaderLeft">
            <div className="dot" title="拖动" />
          </div>
          <div className="DbRndHeaderRight">
            {extraHeader}
            {value ? (
              <ShrinkOutlined
                className="hover-scale"
                title="退出全屏"
                onClick={() => {
                  toggleFullScroll(false)
                  setPositionStyle(positionStyleRef.current!)
                }}
              />
            ) : (
              <ArrowsAltOutlined
                title="全屏"
                className="hover-scale"
                onClick={() => {
                  setPositionStyle((s) => {
                    const data = {
                      ...s,
                      x: 0,
                      y: 0,
                      width: '100vw',
                      height: '100vh',
                    }
                    positionStyleRef.current = s
                    return data
                  })
                  toggleFullScroll(true)
                }}
              />
            )}
            <CloseOutlined title="关闭" className="ml10 hover-scale" onClick={handleClose} />
          </div>
        </div>
        <div className="DbRndContent" key={renderKey}>
          {resetProps.children}
        </div>
      </div>
    </Rnd>,
    document.body,
  )
}
export default DbJonDock
