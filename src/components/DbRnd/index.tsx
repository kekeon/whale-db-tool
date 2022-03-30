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

interface editOptions {
  onEdit: () => void
}

interface Props {
  onClose?: () => void
  editOptions?: editOptions
}
type PropsExtra = Props
const DbJonDock: React.FC<PropsExtra> = ({ editOptions, onClose }) => {
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
            <div className="dot" />
          </div>
          <div className="DbRndHeaderRight">
            {editOptions && <EditOutlined className="hover-scale" onClick={editOptions.onEdit} />}
            {value ? (
              <ShrinkOutlined
                className="hover-scale"
                onClick={() => {
                  toggleFullScroll(false)
                  setPositionStyle(positionStyleRef.current!)
                }}
              />
            ) : (
              <ArrowsAltOutlined
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
            <CloseOutlined className="ml10 hover-scale" onClick={handleClose} />
          </div>
        </div>
        <div className="DbRndContent" key={renderKey}>
          {props.children}
        </div>
      </div>
    </Rnd>,
    document.body,
  )
}
export default DbJonDock
