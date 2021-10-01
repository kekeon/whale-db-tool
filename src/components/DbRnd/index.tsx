import React from 'react'
import { Rnd } from 'react-rnd'
import styles from './index.module.less'

interface Props {}
type PropsExtra = Props
const DbJonDock: React.FC<PropsExtra> = () => {
  return (
    <Rnd
      className={styles.DbRnd}
      default={{
        x: 40,
        y: 40,
        width: 200,
        height: 200,
      }}
    >
      Rnd
    </Rnd>
  )
}
export default DbJonDock
