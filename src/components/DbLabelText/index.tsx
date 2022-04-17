import React from 'react'
import style from './index.module.less'
interface Props {
  text: string
}
type PropsExtra = Props
const DbLabelText: React.FC<PropsExtra> = (props) => {
  return (
    <>
      <span className={style['db-label-text']}>{props.text}：</span>
      {props.children}
    </>
  )
}
export default DbLabelText
