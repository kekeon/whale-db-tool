// axios 和 公共请求方法封装
import axios from 'axios'
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios/index'
import storage from './storage'

import { confirmTips, successTip, warnTipsDiag } from './tips'

export interface GetOpt {
  isCache?: boolean // isCache: true 缓存数据，并从缓存中去；
  isRefresh?: boolean // isRefresh：true 不从缓存中去拿数据， 并会刷新缓存数据,
  suffixUrl?: string
}

export interface PostOpt {
  text?: string
  hidden?: boolean
}

export interface requestResponse<T> {
  data: T
}

export interface Response extends AxiosResponse {
  data: {
    [k: string]: any
    code: number
    message: any
    data: requestResponse<any>
  }
}

declare interface HttpInstance {
  get<T>(url: string, params?: object, opt?: GetOpt): Promise<requestResponse<T>>

  post<T>(url: string, params: object, opt?: PostOpt): Promise<requestResponse<T>>

  put<T>(url: string, params: object, opt?: PostOpt): Promise<requestResponse<T>>

  delete<T>(url: string, params: object, opt?: PostOpt): Promise<requestResponse<T>>
}

interface ErrorMessage {
  [k: string]: string
}

// 错误码
const ERROR_CODE_MAP: ErrorMessage = {
  '201': '新建或修改数据成功。',
  '202': '一个请求已经进入后台排队（异步任务）。',
  '204': '删除数据成功。',
  '400': '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  '401': '用户没有权限（令牌、用户名、密码错误）。',
  '403': '用户得到授权，但是访问是被禁止的。',
  '404': '访问页面不存在。',
  '406': '请求的格式不可得。',
  '410': '请求的资源被永久删除，且不会再得到的。',
  '422': '当创建一个对象时，发生一个验证错误。',
  '500': '服务器发生错误，请检查服务器。',
  '502': '网关错误。',
  '503': '服务不可用，服务器暂时过载或维护。',
  '504': '网关超时。',
}

class Http implements HttpInstance {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: '/api/v1/', // 接口前缀
      timeout: 60000, // 设置响应超时时间
    })

    // 请求拦截
    this.instance.interceptors.request.use(
      (config) => {
        if (config.method === 'post') {
          // 强制设置表单提交格式，兼容其他浏览器,只需要传json
          // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          config.headers['Content-Type'] = config.headers['Content-Type']
            ? config.headers['Content-Type']
            : 'application/json'
        }
        if (config.method === 'get') {
          config.params = {
            ...config.params,
          }
        }
        // 设置token
        const token = 'Bearer ' + storage().getLocal('AUTH_TOKEN', 'o2222')
        token && (config.headers.Authorization = token)
        return config
      },
      (error) => Promise.reject(error),
    )

    // 响应拦截
    this.instance.interceptors.response.use(
      (response: Response) => {
        if (response.status === 200) {
          const code = response.data && Number(response.data.code)
          if (code !== 0) {
            // 失败
            if (code === 7) {
              warnTipsDiag('未登录或登录已过期，请重新登录')
              // 清除用户信息
              setTimeout(() => {
                window.location.pathname = '/login'
              }, 1000)
            } else {
              confirmTips(response.data.message || ERROR_CODE_MAP[response.data.code.toString()])
            }
            return Promise.reject(response)
          }
          return Promise.resolve(response)
        }
        warnTipsDiag(ERROR_CODE_MAP[response.status.toString()])
        return Promise.reject(response)
      },
      (error) => {
        let errorMessage = ''
        if (typeof error === 'string') {
          errorMessage = error
        } else if (error as Error) {
          const reg = /timeout/g
          if (reg.test(error.message)) {
            errorMessage = '抱歉，操作超时, 请稍后再试'
          } else {
            errorMessage = ERROR_CODE_MAP[error.response.status]
          }
        }
        warnTipsDiag(errorMessage)
        return Promise.reject(error)
      },
    )
  }

  /**
   * get方法，对应get请求
   * @param { String } url [请求的url地址]
   * @param { Object } params [请求时携带的参数]
   * @param { Object } opt [请求时配置的参数]  isCache: true 缓存数据，并从缓存中去；isRefresh：true 不从缓存中去拿数据， 并会刷新缓存数据,suffixUrl: string 给url加后缀
   */
  public get<T>(url: string, params?: object, opt: GetOpt = { isCache: false, isRefresh: false }) {
    return new Promise<requestResponse<T>>((resolve, reject) => {
      // opt中的参数，数据缓存,isCache:是否需要缓存, isRefresh: 是否强刷缓存, url 作为key, 缓存时间 7*24*3600*1000

      if (opt.isCache && !opt.isRefresh) {
        const key = url.replace(/\//g, '_').toLocaleUpperCase()
        const res = storage().gGetLocal(key, false)
        // 缓存中存在有效
        if (res) {
          resolve(res)
          return false
        }
      }

      this.instance
        .get(url, { params, ...opt })
        .then((res) => {
          // 响应后缓存结果

          if (res.data.list === null) {
            res.data.list = []
          }

          if (opt.isCache) {
            const key = url.replace(/\//g, '_').toLocaleUpperCase()
            storage().setLocal(key, res.data, 60000)
          }

          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    }).catch((err) => {
      return Promise.reject(err)
    })
  }

  /**
   * post方法，对应post请求
   * @param { String } url [请求的url地址]
   * @param { Object } params [请求时携带的参数]
   * @param { Object } opt [请求时配置的参数]  hidden: 参数 true 隐藏提示
   */

  public post<T>(url: string, params: object, opt: PostOpt = { text: '操作成功', hidden: true }) {
    return new Promise<requestResponse<T>>((resolve, reject) => {
      // 添加后缀
      this.instance
        .post(url, params, opt)
        .then((res) => {
          if (!opt.hidden) {
            successTip(opt.text ? opt.text : '操作成功')
          }
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    }).catch((err) => {
      return Promise.reject(err)
    })
  }

  public put<T>(url: string, params: object, opt: PostOpt = { text: '更新成功', hidden: true }) {
    return new Promise<requestResponse<T>>((resolve, reject) => {
      // 添加后缀
      this.instance
        .put(url, params, opt)
        .then((res) => {
          if (!opt.hidden) {
            successTip(opt.text ? opt.text : '更新成功')
          }
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    }).catch((err) => {
      return Promise.reject(err)
    })
  }

  public delete<T>(url: string, params: object, opt: PostOpt = { text: '删除成功', hidden: true }) {
    return new Promise<requestResponse<T>>((resolve, reject) => {
      this.instance
        .delete(url, { data: params, ...opt })
        .then((res) => {
          if (!opt.hidden) {
            successTip(opt.text ? opt.text : '删除成功')
          }
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    }).catch((err) => {
      return Promise.reject(err)
    })
  }
}

let httpInstance: HttpInstance | null = null
export default (() => {
  if (!httpInstance) {
    httpInstance = new Http()
  }
  return httpInstance
})()
