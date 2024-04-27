<template>
  <a-card :bordered="false" style="margin-bottom: 16px">
    <a-row :gutter="20">
      <a-col :sm="24" :lg="16" :xl="16" :xxl="16">
        <a-spin :loading="priceLoading" style="width: 100%">
          <v-chart class="chart" :option="option" autoresize />
        </a-spin>
      </a-col>
      <a-col :sm="24" :lg="8" :xl="8" :xxl="8">
        <div class=""></div>
        <a-spin :loading="forcastLoading" style="width: 100%">

          <a-card :bordered="false" class="chart" style="margin: 15px 0 0" :header-style="{ padding: '16px 0' }"
            :body-style="{ padding: '16px 0' }">
            <template #title>
              <a-space><icon-computer /> 预测</a-space>
            </template>
            {{ forcast || '-' }}
          </a-card>
        </a-spin>
      </a-col>
    </a-row>

  </a-card>
</template>

<script lang="ts" setup>

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref, watch } from "vue";
import moment from 'moment'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const props = defineProps<{
  priceLoading: boolean
  forcastLoading: boolean
  symbol: string | undefined
  prices: any
  forcast: string
}>()

watch(() => props.prices, (val) => {
  setOption()
})

let option = ref({})

const setOption = () => {
  const xData: string[] = []
  const seriesData: number[] = []
  props.prices.forEach((item: any) => {
    const { time, price } = item
    xData.push(moment(time).format('YYYY-MM-DD'))
    seriesData.push(price)
  })
  option.value = {
    title: {
      text: props.symbol,
      left: "left"
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c}"
    },
    color: ['#165dff'],
    // legend: {
    //   orient: "vertical",
    //   left: "left",
    //   data: ["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"]
    // },
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: seriesData,
        type: 'line',
        smooth: true
      }
    ]
  }
}
</script>

<style scoped lang="less">
.chart {
  height: 350px;
}
</style>