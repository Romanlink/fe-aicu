import { get, post } from '@/plugins/request'

/**
 * 注册
 * @param params 
 * @returns 
 */
export function accountRegister(params: any) {
    return post('/public/account/register', params)
} 

/**
 * 用户登录
 * @param params 
 * @returns hhh
 */
export function accountLogin(params: any) {
    return post('/public/account/login', params)
} 

/**
 * 重置密码
 * @param params 
 * @returns hhh
 */
export function resetPassword(params: any) {
    return post('/public/account/rest-password', params)
} 

/**
 * 补充公司信息
 * @param params 
 * @returns hhh
 */
export function addCompany(params: any) {
    return post('/account/add-company', params)
} 