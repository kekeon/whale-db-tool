import { commonGlobalLoading } from '@/store/common'
import { message } from 'antd'
import { useSetRecoilState } from 'recoil'

const useAsyncLoading = <T>(asyncFunc: (...args: any) => T) => {
  const setCommonGlobalLoadingState = useSetRecoilState(commonGlobalLoading)
  return async (...args: any) => {
    setCommonGlobalLoadingState(true)
    try {
      await asyncFunc(...args)
    } catch (error) {
      console.error(error)
      message.warn('加载失败')
    } finally {
      setCommonGlobalLoadingState(false)
    }
  }
}

export default useAsyncLoading
