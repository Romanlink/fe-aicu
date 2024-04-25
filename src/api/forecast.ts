import { post } from '@/plugins/request'

/**
 * 获取Region列表
 * @param params 
 * @returns 
 */
export function regionListApi(params: any) {
    return post('/region/list', params)
} 

/**
 * 获取交易商品信息
 * @param params 
 * @returns 
 */
export function symbolListApi(params: any) {
    return post('/symbol/list', params)
} 

/**
 * 获取交易商品新闻信息
 * @param params 
 * @returns 
 */
export function symbolNewsApi(params: any) {
    return post('/symbol/news', params)
} 

/**
 * 获取交易商品⾏情信息
 * @param params 
 * @returns 
 */
export function symbolPriceApi(params: any) {
    return post('/symbol/price', params)
} 

/**
 * 获取预测分析
 * @param params 
 * @returns 
 */
export function symbolForecastApi(params: any) {
    return post('/symbol/forecast', params)
} 

/**
 * 获取预测分析
 * @param params 
 * @returns 
 */
export function symbolNewsChartApi(params: any) {
    return post('/symbol/news-chart', params)
} 

