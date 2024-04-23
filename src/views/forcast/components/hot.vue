<template>
  <a-card :bordered="false">
    <a-row :gutter="20">
      <a-col :sm="24" :lg="16" :xl="16" :xxl="16">
        <a-card :bordered="false" :header-style="{ padding: '16px 0' }" :body-style="{ padding: '16px 0' }">
          <template #title>
            <a-space><icon-fire /> 热点 </a-space>
          </template>
          <a-spin :loading="newsLoading" style="width: 100%">
            <div class="news">
              <div class="new" v-for="(m, newIndex) in news.data" :key="newIndex">
                <div class="new-title">
                  <a class="full-cover-link" :href="m.url || ''" target="_blank"></a>
                  {{ m.title }}
                </div>
                <div class="new-time"><a-tag size="small" color="orange" bordered>{{ m.level }}</a-tag>{{
                  moment(m.time).format('YYYY-MM-DD HH:mm:ss') }}</div>
                <div class="new-desc">
                  {{ m.content }}
                </div>
              </div>
            </div>
            <div class="page">
              <a-pagination :total="total" />
            </div>
          </a-spin>
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
import { ref, watch } from "vue";
import moment from 'moment'


const props = defineProps<{
  newsLoading: boolean
  news: any
}>()

const total = ref<number>(0)

watch(() => props.news, (val) => {
  total.value = props.news.data.length || 0
})



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