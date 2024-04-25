<template>

  <a-row style="margin-bottom: 16px">
    <a-col :span="24">
      <a-spin :loading="loading" style="width: 100%">
        <a-card :bordered="false">
          <a-space direction="vertical" fill>
            <div style="margin:0 0 10px 0">利用AI技术帮助企业预测其市场动态，了解推动这些趋势的潜在因素</div>

            <div class="filter-row">
              <div class="filter-row-title">地区</div>
              <div class="filter-row-items">
                <div class="filter-row-items-item" :class="filter.region === region.id ? 'active' : ''"
                  v-for="(region, regionIndex) in regions" :key="regionIndex" @click="onRegionChange(region)">{{
                    region.name }}</div>
              </div>
            </div>
            <div class="filter-row">
              <div class="filter-row-title">品类</div>
              <div class="filter-row-items">
                <div class="filter-row-items-item" :class="filter.symbol === symbol.id ? 'active' : ''"
                  v-for="(symbol, symbolIndex) in symbols" :key="symbolIndex" @click="onSymbolChange(symbol)">{{
                    symbol.name }}</div>
              </div>
            </div>
            <div class="filter-row">
              <div class="filter-row-title padding-no">预测</div>
              <a-radio-group v-model="filter.nextPart" :options="dateOptions" @change="onNextPartChange" />
              <div class="time">最近更新：{{ forcastDate }}</div>
            </div>
            <a-alert v-if="userInfo.status !== 1" type="warning" style="margin:10px 0 0" :closable="true">
              <template #icon>
                <icon-exclamation-circle-fill />
              </template>
              未来1天以外数据需要开通正式版可用
            </a-alert>
          </a-space>
        </a-card>
      </a-spin>
    </a-col>
  </a-row>

</template>

<script lang="ts" setup>

import { ref, watch, computed, onMounted, defineEmits } from 'vue'
import { IRegion, ISymbol, iFilter } from '../type'
import { useUserStore } from '@/store';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo)

const emit = defineEmits(['regionChange', 'symbolChange', 'nextPartChange']);

const props = defineProps<{
  regions: IRegion[]
  symbols: ISymbol[]
  forcastDate: string | undefined
  loading: boolean
}>()

watch(() => props.regions, (val) => {
  if (val && val.length) {
    filter.value.region = val[0].id
    // emit('regionChange', val[0].id)
  }
})

watch(() => props.symbols, (val) => {
  if (val && val.length) {
    filter.value.symbol = val[0].id
    // emit('symbolChange', val[0].id, val[0].name)
  }
})

const filter = ref<iFilter>({
  nextPart: 1
})

// region change event
const onRegionChange = (region: IRegion) => {
  filter.value.region = region.id
  emit('regionChange', region.id)
}

// symbol change event
const onSymbolChange = (symbol: ISymbol) => {
  filter.value.symbol = symbol.id
  emit('symbolChange', symbol.id, symbol.name)
}

// next part change event
const onNextPartChange = (val: any) => {
  emit('nextPartChange', val)
}

const dateOptions = ref([
  { label: '未来1天', value: 1 },
  { label: '未来2天', value: 2, disabled: false },
  { label: '未来3天', value: 3, disabled: false },
])

onMounted(() => {
  // 非正式会员
  if (userInfo.value.status !== 1) {
    dateOptions.value = [
      { label: '未来1天', value: 1 },
      { label: '未来2天', value: 2, disabled: true },
      { label: '未来3天', value: 3, disabled: true },
    ]
  }
})

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