<template>
  <a-card :bordered="false">
    <a-row :gutter="20">
      <a-col :sm="24" :lg="16" :xl="16" :xxl="16">
        <a-card :bordered="false" :header-style="{ padding: '16px 0' }" :body-style="{ padding: '16px 0' }">
          <template #title>
            <s-space><icon-fire /> 热点 </s-space>
          </template>
          <div class="news">
            <div class="new" v-for="(m, newIndex) in 10" :key="newIndex">
              <div class="new-title">
                <a class="full-cover-link"></a>
                住建部长：支持不同所有制房企合理融资需求，白名单项目已审批贷款超2000亿元
              </div>
              <div class="new-time"><a-tag size="small" color="orange" bordered>正面</a-tag>2020.03.04 12:00:00</div>
              <div class="new-desc">
                十四届全国人大二次会议9日下午举行记者会，住房和城乡建设部部长倪虹表示，防风险，要一视同仁，支持不同所有制房地产企业合理融资需求。当前房地产的难点是资金，我们在调研当中好的企业也有困难的项目，困难的企业我们也看到有好的项目，为此我们会同金融监管总局指导地方建立城
              </div>
            </div>
          </div>
          <div class="page">
            <a-pagination :total="200" />
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :lg="8" :xl="8" :xxl="8">
        <v-chart class="chart" :option="option" autoresize />
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
    text: "市场情绪",
    left: "left"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});



</script>

<style scoped lang="less">
.chart {
  height: 350px;
}

.news {
  display: flex;
  flex-direction: column;

  .new {
    display: flex;
    flex-direction: column;
    border: 1px solid #f2f3f5;
    margin: 0 0 10px 0;
    padding: 10px;
    position: relative;

    &-title {
      position: relative;
      color: #000;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-title:hover {
      text-decoration: underline;
    }

    &-time {
      display: flex;
      align-items: center;
      margin: 10px 0 0;
      color: #999;

      .arco-tag {
        margin: 0 10px 0 0;
      }
    }

    &-desc {
      margin: 10px 0 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

  .full-cover-link {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
    cursor: pointer;
  }
}

.page {
  display: flex;
  justify-content: center;
  margin: 20px 0 0;
}
</style>