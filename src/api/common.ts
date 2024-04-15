import { get, post } from '@/plugins/request'

/**
 * 发送验证码
 * @param params 
 * @returns 
 */
export function sendSmsCode(params: any) {
    return post('/public/common/sendCode', params)
} 
