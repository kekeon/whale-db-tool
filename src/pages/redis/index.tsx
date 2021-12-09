import { ConnectedEnum } from '@/constant/js'
import { useConnectedList } from '@/hooks'
import { redisCmd } from '@/service/redis'
import React, { useState } from 'react'
import DbConnectList from '_cp/DbConnectList'
import DBEditConnectModal from '_cp/DBEditConnectModal'
import style from './index.module.less'

interface RedisPageProps {
  to: string
}
const Redis: React.FC<RedisPageProps> = () => {
  /*  connect start */
  const {
    connectList,
    addVisible,
    editInfo,
    handleListConnect,
    handleConnectAddForm,
    handleConnectedEdit,
    handleConnectedDelete,
    handleConnectedFormVisible,
  } = useConnectedList({ type: ConnectedEnum.REDIS })

  const handleChangeConnect = async (uuid) => {
    const res = await redisCmd(uuid)
    console.log('res', res)
  }
  const handleAddOk = () => {}
  const handleAddCancel = () => {
    handleConnectedFormVisible(false)
  }

  /*  connect end */

  return (
    <section className={style.redis}>
      <div className="db-connect-wrap">
        <DbConnectList
          list={connectList}
          onAdd={handleConnectAddForm}
          onDelete={handleConnectedDelete}
          onChange={handleChangeConnect}
          onEdit={handleConnectedEdit}
        />
      </div>
      <div>
        <div className="db-data-wrap" />
      </div>

      {addVisible && (
        <DBEditConnectModal
          type={ConnectedEnum.REDIS}
          title="Redis"
          visible={addVisible}
          onOk={handleAddOk}
          onCancel={handleAddCancel}
          initInfo={editInfo || {}}
        />
      )}
    </section>
  )
}
export default Redis
