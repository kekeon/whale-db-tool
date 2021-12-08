import { IDBItem } from '@/types/commonTypes'
import React, { useState } from 'react'
import DbConnectList from '_cp/DbConnectList'
import style from './index.module.less'

interface RedisPageProps {}
const Redis: React.FC<RedisPageProps> = () => {
  const [connectList, setConnectList] = useState<IDBItem[]>()
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
export default RedisPageProps
