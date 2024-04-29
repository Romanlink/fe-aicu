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
  let seriesData1: number[] = []
  let seriesData2: number[] = []
  const prices: number[] = []
  props.prices.forEach((item: any) => {
    const { time, price } = item
    xData.push(moment(time).format('YYYY-MM-DD'))
    if (item.type == 1) {
      seriesData1.push(price)
    }
    
    seriesData2.push(price)

    if (price) {
      prices.push(price)
    }
  })


  console.log(seriesData1)
  console.log(seriesData2)

  prices.sort()
  const min = prices[0] - 500 < 0 ? 0 : prices[0] - 500
  const max = prices[prices.length - 1] + 500

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
      type: 'value',
      min,
      max
    },
    series: [
      {
        data: seriesData1,
        type: 'line',
      },
      {
        data: seriesData2,
        type: 'line',
        itemStyle: {
          normal: {
            lineStyle: {
              width: 1,
              type: 'dotted'  //'dotted'点型虚线 'solid'实线 'dashed'线性虚线
            }
          }
        },
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