import { ConnectedEnum } from '@/constant/js'
import { connectedDelete, connectedList } from '@/service/connected'
import { common } from '@/types'
import { cuid, IDBItem } from '@/types/commonTypes'
import { useBoolean } from 'ahooks'
import { SetStateAction, useEffect, useState } from 'react'

interface IUseConnectedListProps {
  type: ConnectedEnum
}

const useConnectedList = ({ type }: IUseConnectedListProps) => {
  const [connectList, setConnectList] = useState<IDBItem[]>([])
  const [addVisible, { toggle }] = useBoolean(false)
  const [editInfo, setEditInfo] = useState<Partial<cuid>>()

  const handleListConnect = async () => {
    let dbList = await connectedList(type)
    setConnectList(dbList)
  }

  const handleConnectAddForm = async () => {
    toggle(true)
    setEditInfo({})
  }

  const handleConnectedEdit = (data: SetStateAction<Partial<cuid> | undefined>) => {
    setEditInfo(data)
    toggle(true)
  }

  const handleConnectedDelete = async (uuid: common.uuid) => {
    await connectedDelete({ uuid })
    handleListConnect()
  }

  useEffect(() => {
    handleListConnect()
  }, [])

  return {
    connectList,
    addVisible,
    editInfo,
    handleListConnect,
    handleConnectAddForm,
    handleConnectedEdit,
    handleConnectedDelete,
    handleConnectedFormVisible: toggle,
  }
}

export default useConnectedList
