/**
 * 浏览器缓存组件
 * 添加缓存 SetLocal('mycache', 123, 7*24*3600*1000); // stamp 缓存时间戳
 * 获取缓存 GetLocal('mycache');
 *
 * @class CacheManager
 */

/**
 * 缓存中的数据格式： {exp: stamp, v:<data>}
 */
class CacheManager {
  private localStorage: Storage

  constructor() {
    this.localStorage = window.localStorage
  }

  /**
   * set localStorage
   * @param key
   * @param value
   * @param effectiveTime 有效时长
   */
  setLocal(key: string, value: any, effectiveTime: number = 7 * 24 * 360000) {
    let exp = effectiveTime > 0 ? new Date().valueOf() + effectiveTime : effectiveTime

    let cacheData = {
      exp: exp,
      v: value,
    }

    this.localStorage.setItem(key, JSON.stringify(cacheData))
  }

  getLocal(key: string, defaultValue?: any): void {
    let val = this.localStorage.getItem(key)
    let nowTime = +new Date()

    let obj = JSON.parse(val as string)
    if (!obj) {
      return defaultValue
    }
    // 过期
    if (Number(obj.exp) > 0 && nowTime > obj.exp) {
      this.localStorage.removeItem(key)
      return defaultValue
    }
    return obj.v || (obj.v === 0 ? 0 : defaultValue)
  }

  removeLocal(key: string) {
    this.localStorage.removeItem(key)
  }

  clearLocal() {
    this.localStorage.clear()
  }
}

// 初始化缓存对象

let cacheInstance: CacheManager | null = null

export default () => {
  if (!cacheInstance) {
    cacheInstance = new CacheManager()
  }
  return cacheInstance
}
