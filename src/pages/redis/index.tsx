import React, { useState } from 'react'
import DbConnectList from '_cp/DbConnectList'
import style from './index.module.less'

interface PropsExtra {}
const Redis: React.FC<PropsExtra> = () => {
  const [connectList, setConnectList] = useState<unknown[]>()

  return (
    <section className={style.redis}>
      <div className="db-connect-wrap">
        <DbConnectList list={connectList} />
      </div>
      <div>
        <div className="db-data-wrap" />
      </div>
    </section>
  )
}
export default Redis
