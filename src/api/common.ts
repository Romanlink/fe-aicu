import { get, post } from '@/plugins/request'

/**
 * 发送验证码
 * @param params 
 * @returns 
 */
export function sendSmsCode(params: any) {
    return post('/public/common/sendCode', params)
} 

/**
 * 上传图⽚
 * @param params 
 * @returns 
 */
export function imageUploadApi(params: any) {
    return post('/project/image/upload', params)
} 

/**
 * 下载/预览图⽚
 * @param params 
 * @returns 
 */
export function imageViewApi(params: any) {
    return post('/project/image/view', params)
} 
