import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'
import { getStorage } from '@/utils/arco-storage'

const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
  // baseURL: '/api/v2',
  timeout: 1000 * 60, // 请求超时时间 60s
  headers: {
    AuthToken: getStorage('AuthToken') || '',
    'Content-Type': 'application/json',
    'Accept': '*/*',
  }
})

service.interceptors.request.use(
  (config) => {
    // const token = useAuthStore().token
    // if (token)
    //   config.headers.Authorization = `Bearer ${token}`
    const token = getStorage('AuthToken')
    token && (config.headers['AuthToken'] = token)
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
