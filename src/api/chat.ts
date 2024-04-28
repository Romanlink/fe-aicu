import { post } from '@/plugins/request'

/**
 * 猜你想问
 * @param params 
 * @returns 
 */
export function chatGus(params: any) {
    return post('/chat/gus', params)
} 

/**
 * 查询当前对话ID
 * @param params 
 * @returns 
 */
export function getCurChatIdApi(params: any) {
    return post('/account/cur-chat', params)
} 

/**
 * 查询对话列表
 * @param params 
 * @returns 
 */
export function getChatListApi(params: any) {
    return post('/chat/list', params)
} 

/**
 * 对话详情
 * @param params 
 * @returns 
 */
export function getChatDetailApi(params: any) {
    return post('/chat/info', params)
} 


/**
 * 新建对话
 * @param params 
 * @returns 
 */
export function chatCreateApi(params: any) {
    return post('/chat/create', params)
} 


/**
 * 修改对话
 * @param params 
 * @returns 
 */
export function chatEditApi(params: any) {
    return post('/chat/edit', params)
} 


/**
 * 删除对话
 * @param params 
 * @returns 
 */
export function chatDeleteApi(params: any) {
    return post('/chat/delete', params)
} 
