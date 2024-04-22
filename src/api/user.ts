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

/**
 * 用户信息
 * @param params 
 * @returns hhh
 */
export function accountInfo(params: any) {
    return post('/account/info', params)
} 

/**
 * 修改昵称
 * @param params 
 * @returns hhh
 */
export function accountEdit(params: any) {
    return post('/account/edit', params)
} 

/**
 * 修改密码
 * @param params 
 * @returns hhh
 */
export function modifyPass(params: any) {
    return post('/account/modify-pass', params)
} 


/**
 * 修改头像
 * @param params 
 * @returns hhh
 */
export function modifyHdApi(params: any) {
    return post('/account/modify-hd', params)
} 

/**
 * 修改公司名称
 * @param params 
 * @returns hhh
 */
export function orgEditApi(params: any) {
    return post('/org/edit', params)
} 

/**
 * 管理员列表
 * @param params 
 * @returns hhh
 */
export function accountListApi(params: any) {
    return post('/account/list', params)
} 

/**
 * 新增员工
 * @param params 
 * @returns hhh
 */
export function accountBindApi(params: any) {
    return post('/account/bind', params)
} 

/**
 * 提升管理员
 * @param params 
 * @returns hhh
 */
export function accountUpApi(params: any) {
    return post('/account/up', params)
} 

/**
 * 退出公司
 * @param params 
 * @returns hhh
 */
export function accountUnbindApi(params: any) {
    return post('/account/unbind', params)
} 




