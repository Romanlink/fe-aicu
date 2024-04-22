<template>
  <div class="arco-container">
    <Breadcrumb :items="['预测分析']" />

    <Filter :loading="loading.filter" :regions="regions" :symbols="symbols" :forcastDate="forcastDate"
      @regionChange="regionChange" @symbolChange="symbolChange" @nextPartChange="nextPartChange" />

    <Forcast :priceLoading="loading.price" :forcastLoading="loading.forcast" :symbol="filter.symbolName"
      :prices="prices" :forcast="forcastData" />

    <Hot :newsLoading="loading.news" :news="news"  />

  </div>
</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';
import { regionListApi, symbolListApi, symbolNewsApi, symbolPriceApi, symbolForecastApi } from '@/api/forecast'

import Filter from './components/filter.vue'
import Forcast from './components/forcast.vue';
import Hot from "./components/hot.vue"
import { IRegion, ISymbol } from './type'
import moment from 'moment'

const regions = ref<IRegion[]>([])
const symbols = ref<ISymbol[]>([])
const forcastDate = ref<string | undefined>()
const loading = ref<{
  filter: boolean;
  price: boolean,
  news: boolean,
  forcast: boolean
}>({
  filter: false,
  price: false,
  news: false,
  forcast: false
})

const filter = ref<{ regionId?: number; symbolId?: number; symbolName?: string; nextPart?: number }>({
  nextPart: 1
})

const prices = ref<any>([])
const news = ref<any>([])
const forcastData = ref<string>('')

// region change event
const regionChange = (id: number) => {
  filter.value.regionId = id
  fetchForecastData()
}

// symbol change event
const symbolChange = (id: number, name: string) => {
  filter.value.symbolId = id
  filter.value.symbolName = name
  fetchSymbolPrice()
  fetchSymbolNews()
  fetchForecastData()
}

// next part change event
const nextPartChange = (nextPart: number) => {
  filter.value.nextPart = nextPart
  fetchForecastData()
}

// 获取地区列表
const fetchRegionList = async () => {
  return new Promise(resolve => {
    regionListApi({}).then((res: any) => {
      regions.value = res || []
      filter.value.regionId = res[0].id
      resolve(res)
    })
  })

}

// 获取商品列表
const fetchSymbolList = async () => {
  return new Promise(resolve => {
    symbolListApi({}).then((res: any) => {
      symbols.value = res || []
      filter.value.symbolId = res[0].id
      filter.value.symbolName = res[0].name
      resolve(res)
    })
  })
}

// 获取价格详情
const fetchSymbolPrice = async () => {
  loading.value.price = true
  const startTime = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss')
  const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
  symbolPriceApi({ id: filter.value.symbolId, startTime, endTime }).then((res) => {
    console.log(res)
    prices.value = res || []
  }).finally(() => {
    loading.value.price = false
  })
}

// 获取交易商品新闻信息
const fetchSymbolNews = async () => {
  loading.value.news = true
  symbolNewsApi({ id: filter.value.symbolId }).then((res:any) => {
    news.value = res || []
  }).finally(() => {
    loading.value.news = false
  })
}

// 获取预测分析
const fetchForecastData = async () => {
  loading.value.forcast = true
  forcastDate.value = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss')
  symbolForecastApi({ id: filter.value.symbolId, regionId: filter.value.regionId, nextPart: filter.value.nextPart }).then((res: any) => {
    forcastData.value = res || ''
  }).finally(() => {
    loading.value.forcast = false
  })
}

onMounted(async () => {
  loading.value.filter = true
  loading.value.news = true
  loading.value.price = true
  loading.value.forcast = true
  await fetchRegionList()
  await fetchSymbolList()
  loading.value.filter = false

  fetchSymbolPrice()
  fetchSymbolNews()
  fetchForecastData()
})



</script>

<style scoped lang="less">
.arco-container {
  padding: 0 16px 16px 16px;
}

.wrapper {
  padding: 16px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

:deep(.section-title) {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
