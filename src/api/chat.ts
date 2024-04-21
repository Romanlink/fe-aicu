import { post } from '@/plugins/request'

/**
 * 猜你想问
 * @param params 
 * @returns 
 */
export function chatGus(params: any) {
    return post('/chat/gus', params)
} 
