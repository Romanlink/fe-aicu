<template>
    <a-card :bordered="false" style="margin-bottom: 16px">
        <a-row :gutter="20">
            <a-col :sm="24" :lg="16" :xl="16" :xxl="16">
                <v-chart class="chart" :option="option" autoresize />
            </a-col>
            <a-col :sm="24" :lg="8" :xl="8" :xxl="8">
                <div class=""></div>

                <a-card :bordered="false" style="margin: 15px 0 0" :header-style="{ padding: '16px 0' }"
                    :body-style="{ padding: '16px 0' }">
                    <template #title>
                        <s-space><icon-computer /> 预测</s-space>
                    </template>
                    预计2024年3月4日螺纹钢价格达到xxxx元，建议卖出，市场情绪为中立。
                    宏观上受xxx影响，xxxxx。
                </a-card>
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
import { ref } from "vue";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const option = ref({
  title: {
    text: "螺纹钢",
    left: "left"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  color: ['#165dff'],
  legend: {
    orient: "vertical",
    left: "left",
    data: ["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"]
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }
  ]
});



</script>

<style scoped lang="less">
.chart {
  height: 350px;
}
</style>