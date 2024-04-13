<template>
    <a-row style="margin-bottom: 16px">
        <a-col :span="24">
            <a-card :bordered="false">
                <a-space direction="vertical" fill>
                    <div style="margin:0 0 10px 0">利用AI技术帮助企业预测其市场动态，了解推动这些趋势的潜在因素</div>

                    <div class="filter-row">
                        <div class="filter-row-title">地区</div>
                        <div class="filter-row-items">
                            <div class="filter-row-items-item"
                                :class="filterActiveIndex.area === areaIndex ? 'active' : ''"
                                v-for="(area, areaIndex) in 17" :key="areaIndex"
                                @click="filterActiveIndex.area = areaIndex">北京</div>
                        </div>
                    </div>
                    <div class="filter-row">
                        <div class="filter-row-title">品类</div>
                        <div class="filter-row-items">
                            <div class="filter-row-items-item"
                                :class="filterActiveIndex.category === categoryIndex ? 'active' : ''"
                                v-for="(category, categoryIndex) in 13" :key="categoryIndex"
                                @click="filterActiveIndex.category = categoryIndex">螺纹钢</div>
                        </div>
                    </div>
                    <div class="filter-row">
                        <div class="filter-row-title padding-no">预测</div>
                        <a-radio-group v-model="date" :options="dateOptions" />
                        <div class="time">最近更新：2020.3.4 12:00:00</div>
                    </div>
                    <a-alert type="warning" style="margin:10px 0 0" :closable="true">
                        <template #icon>
                            <icon-exclamation-circle-fill />
                        </template>
                        未来1天以外数据需要开通正式版可用
                    </a-alert>
                </a-space>
            </a-card>
        </a-col>
    </a-row>
</template>

<script lang="ts" setup>

import { ref } from 'vue'

const filterActiveIndex = ref({
  area: 0,
  category: 0,
})

const date = ref('1')

const dateOptions = [
  { label: '未来1天', value: '1' },
  { label: '未来2天', value: '2' },
  { label: '未来3天', value: '3', disabled: true },
];

</script>

<style scoped lang="less">
.filter-row {
  display: flex;
  // flex-wrap: wrap;

  &-title {
    margin: 0 20px 10px 0;
    padding: 4px 0;
  }

  &-title.padding-no {
    padding: 0;
    margin: 0 20px 0 0;
  }

  &-items {
    flex: 1;
    display: flex;
    flex-wrap: wrap;

    &-item {
      padding: 3px 15px;
      margin: 0 10px 10px 0;
      border: 1px solid #ddd;
      border-radius: 2px;
      cursor: pointer;
    }

    &-item.active {
      color: #165dff;
      border-color: #165dff;
    }
  }

  .time {
    color: #999;
    margin: 0 0 0 20px;
    font-size: 12px;
  }
}
</style>