import { ConnectedEnum } from '@/constant/js'
import { useConnectedList } from '@/hooks'
import { redisConfigCmd, redisKeysCmd } from '@/service/redis'
import { Select } from 'antd'
import React, { useCallback, useMemo, useState } from 'react'
import DbConnectList from '_cp/DbConnectList'
import DBEditConnectModal from '_cp/DBEditConnectModal'
import style from './index.module.less'

const Option = Select.Option

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
    const res = await redisKeysCmd(uuid)
    console.log('res', res)
  }
  const handleAddOk = () => {}
  const handleAddCancel = () => {
    handleConnectedFormVisible(false)
  }

  /*  connect end */

  const [dbNumber, setDbNumber] = useState(16)
  const [selectDb, setSelectDb] = useState(0)

  const dbListOption = useMemo(() => {
    let dom = []
    for (let i = 0; i < dbNumber; i++) {
      dom.push(
        <Option key={i} value={i}>
          DB{i}
        </Option>,
      )
    }
    return dom
  }, [dbNumber])

  const handleChange = (v) => {
    setSelectDb(v)
  }

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
      <div className="db-data-wrap">
        <div className="db-table">
          <Select value={selectDb} style={{ width: 120 }} onChange={handleChange}>
            {...dbListOption}
          </Select>

          <div className="db-keys-list">
            <div className="db-keys-item">abc</div>
            <div className="db-keys-item select-active">abd</div>
          </div>
          <div />
        </div>
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
