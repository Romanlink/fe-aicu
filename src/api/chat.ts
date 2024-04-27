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
