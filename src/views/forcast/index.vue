<template>
  <div class="arco-container">
    <Breadcrumb :items="['预测分析']" />

    <Filter :loading="loading.filter" :regions="regions" :symbols="symbols" :forcastDate="forcastDate"
      @regionChange="regionChange" @symbolChange="symbolChange" @nextPartChange="nextPartChange" />

    <Forcast :priceLoading="loading.price" :forcastLoading="loading.forcast" :symbol="filter.symbolName"
      :prices="prices" :forcast="forcastData" />

    <Hot :newsLoading="loading.news" :news="news" :chartLoding="loading.newsChart" :chartData="chartData"
      @pageNoChange="pageNoChange" />

  </div>
</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';
import { regionListApi, symbolListApi, symbolNewsApi, symbolPriceApi, symbolForecastApi, symbolNewsChartApi, symbolTimeApi } from '@/api/forecast'

import Filter from './components/filter.vue'
import Forcast from './components/forcast.vue';
import Hot from "./components/hot.vue"
import { IRegion, ISymbol } from './type'
import moment from 'moment'

const regions = ref<IRegion[]>([])
const symbols = ref<ISymbol[]>([])
const forcastDate = ref<string | undefined>('')
const loading = ref<{
  filter: boolean;
  price: boolean,
  news: boolean,
  forcast: boolean,
  newsChart: boolean
}>({
  filter: false,
  price: false,
  news: false,
  forcast: false,
  newsChart: false
})

const filter = ref<{ regionId?: number; symbolId?: number; symbolName?: string; nextPart?: number, pageNo?: number, pageSize?: number }>({
  nextPart: 1,
  pageNo: 1,
  pageSize: 10
})

const prices = ref<any>([])
const news = ref<any>([])
const forcastData = ref<string>('')
const chartData = ref<any>({})

// region change event
const regionChange = (id: number) => {
  filter.value.regionId = id
  fetchSymbolTime()
  fetchData()
}

// symbol change event
const symbolChange = (id: number, name: string) => {
  filter.value.symbolId = id
  filter.value.symbolName = name
  fetchSymbolTime()
  fetchData()
}

// next part change event
const nextPartChange = (nextPart: number) => {
  filter.value.nextPart = nextPart
  fetchData()
}

// page no change event
const pageNoChange = (pageNo: number) => {
  filter.value.pageNo = pageNo
  fetchSymbolNews()
}

const fetchData = () => {
  fetchSymbolPrice()
  fetchForecastData()
  fetchSymbolNews()
  fetchNewsChart()
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

// 获取商品列表
const fetchSymbolTime = async () => {
  const { symbolId, regionId } = filter.value
  return new Promise(resolve => {
    symbolTimeApi({ id: symbolId, regionId }).then((res: any) => {
      forcastDate.value = moment(res).format('YYYY-MM-DD HH:mm:ss')
      resolve(res)
    })
  })
}

// 获取价格详情
const fetchSymbolPrice = async () => {
  loading.value.price = true
  const startTime = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss')
  const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
  symbolPriceApi({ id: filter.value.symbolId, startTime, endTime, regionId: filter.value.regionId, nextPart: filter.value.nextPart }).then((res) => {
    console.log(res)
    prices.value = res || []
  }).finally(() => {
    loading.value.price = false
  })
}

// 获取交易商品新闻信息
const fetchSymbolNews = async () => {
  loading.value.news = true
  const { pageNo, pageSize } = filter.value
  symbolNewsApi({ id: filter.value.symbolId, regionId: filter.value.regionId, nextPart: filter.value.nextPart, pageNo, pageSize }).then((res: any) => {
    news.value = res || []
  }).finally(() => {
    loading.value.news = false
  })
}

// 获取预测分析
const fetchForecastData = async () => {
  loading.value.forcast = true
  // forcastDate.value = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss')
  symbolForecastApi({ id: filter.value.symbolId, regionId: filter.value.regionId, nextPart: filter.value.nextPart }).then((res: any) => {

    // const { nextPart } = filter.value
    // if (res.length) {
    //   switch (nextPart) {
    //     case 1:
    //       forcastData.value = res[0].forecast1
    //       break
    //     case 2:
    //       forcastData.value = res[0].forecast2
    //       break
    //     case 3:
    //       forcastData.value = res[0].forecast3
    //       break
    //   }
    // } else {
    //   forcastData.value = ''
    // }
    forcastData.value = res || ''
  }).finally(() => {
    loading.value.forcast = false
  })
}

// 获取交易商品⾏情信息
const fetchNewsChart = async () => {
  loading.value.newsChart = true
  symbolNewsChartApi({ id: filter.value.symbolId, regionId: filter.value.regionId, nextPart: filter.value.nextPart }).then((res: any) => {
    chartData.value = res || ''
  }).finally(() => {
    loading.value.newsChart = false
  })
}

onMounted(async () => {
  loading.value.filter = true
  loading.value.news = true
  loading.value.price = true
  loading.value.forcast = true
  loading.value.newsChart = true
  await fetchRegionList()
  await fetchSymbolList()
  await fetchSymbolTime()
  loading.value.filter = false

  fetchData()
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
