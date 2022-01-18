import classNames from 'classnames'
import React from 'react'
import styles from './index.module.less'
interface Props {
  className?: string
  radius?: string
}
type PropsExtra = Props
const DbContainer: React.FC<PropsExtra> = ({ className, radius = '8px', children }) => {
  return (
    <div className={classNames(className, styles.DbContainer)} style={{ borderRadius: radius }}>
      {children}
    </div>
  )
}
export default DbContainer
