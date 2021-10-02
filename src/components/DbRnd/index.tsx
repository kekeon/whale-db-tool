import { ArrowsAltOutlined, CloseOutlined, ShrinkOutlined } from '@ant-design/icons'
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
}
type PropsExtra = Props
const DbJonDock: React.FC<PropsExtra> = (props) => {
  const [value, { toggle: toggleFullScroll }] = useToggle(false)
  const positionStyleRef = useRef<positionStyle>()
  const [positionStyle, setPositionStyle] = useState<positionStyle>({
    x: 40,
    y: 40,
    width: 300,
    height: 400,
  })

  const handleClose = () => {
    props.onClose?.()
  }

  return createPortal(
    <Rnd
      className={styles.DbRnd}
      size={{ width: positionStyle?.width, height: positionStyle?.height }}
      position={{ x: positionStyle.x, y: positionStyle.y }}
      onDragStop={(_e, d) => {
        setPositionStyle((s) => ({
          ...s,
          x: d.x,
          y: d.y,
        }))
      }}
      // eslint-disable-next-line max-params
      onResizeStop={(e, _direction, ref, _delta, position) => {
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
            <div className="dot" />
          </div>
          <div className="DbRndHeaderRight">
            {value ? (
              <ShrinkOutlined
                onClick={() => {
                  toggleFullScroll(false)
                  setPositionStyle(positionStyleRef.current!)
                }}
              />
            ) : (
              <ArrowsAltOutlined
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
            <CloseOutlined className="ml10" onClick={handleClose} />
          </div>
        </div>
        <div className="DbRndContent">{props.children}</div>
      </div>
    </Rnd>,
    document.body,
  )
}
export default DbJonDock
