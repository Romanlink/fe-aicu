import axios from 'axios'

import { Message } from '@arco-design/web-vue';
import { getStorage, setStorage } from '@/utils/arco-storage'
import { router } from '@/router/index'

const myAxios = axios.create({
    baseURL: import.meta.env.VITE_GLOB_API_URL,
    timeout: 1000 * 60, // 请求超时时间 60s
    headers: {
        AuthToken: getStorage('AuthToken') || '',
        'Content-Type': 'application/json',
        'Accept': '*/*',
    }
})

myAxios.interceptors.request.use(
    (config: any) => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = getStorage('AuthToken')
        token && (config.headers['AuthToken'] = token)

        if (config.url.indexOf('/image/upload') > -1) {
            config.headers['Content-Type'] = 'multipart/form-data'
        }

        // 重新设置token有效期 30分钟
        if (token) {
            setStorage('AuthToken', token, 30 * 60)
        }

        return config
    },
    (error) => {
        Message.error('请求超时')
        return Promise.reject(error)
    }
)

myAxios.interceptors.response.use(
    (response) => {
        // 200 请求成功
        if ((response.status === 200 || response.status === 201) && response.data.code == 0) {
            if (response.data.data) {
                return Promise.resolve(response.data.data)
            } else {
                // return Promise.resolve(response.data)
                return Promise.resolve('')
            }
        } else if (response.data.code == 'MUC100001' && response.data.message.indexOf('当前公司已注册') > -1) {
            return Promise.resolve(response.data)
        } else if (response.data.code == 401) {
            Message.error(response.data.message)
            return Promise.reject(response.data)
        } else {
            Message.error(response.data.message)
            return Promise.reject(response.data)
        }
    },
    (error) => {
        if (error.response && error.response.data.code == 'MUC300001') {
            Message.error(error.response.data.message || error.response.statusText)
            localStorage.AuthToken = ''
            localStorage.userInfo = ''
            router.push('/login')
            return
        }
        if (error.request.responseURL.indexOf('/chat/gus') > -1) {
            return
        }
        if (error.response && error.response.data.code == 'MUC100001' && error.response.data.message.indexOf('当前公司已注册') > -1) {
            return Promise.resolve(error.response.data)
        } else if (error.response) {
            Message.error(error.response.data.message || error.response.statusText)
        } else {
            Message.error('网络出错了，未请求到数据');
        }
    }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url: string, params: any) {
    for (const key in params) {
        if (!params[key] && params[key] != 0) {
            delete params[key]
        }
    }

    return new Promise((resolve, reject) => {
        myAxios
            .get(url, {
                params
            })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function put(url: string, params: any) {
    return new Promise((resolve, reject) => {
        myAxios
            .put(url, params)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function del(url: string) {
    return new Promise((resolve, reject) => {
        myAxios
            .delete(url)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url: string, params: any) {
    return new Promise((resolve, reject) => {
        myAxios
            .post(url, params)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 文件上传
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function upload(url: string, params: any) {
    return new Promise((resolve, reject) => {
        myAxios
            .post(url, params)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * download 请求二进制文件
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function download(url: string) {
    return new Promise((resolve, reject) => {
        myAxios
            .get(url, {
                responseType: 'blob'
            })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
