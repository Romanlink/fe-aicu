<template>
  <div class="arco-container">
    <Breadcrumb :items="['预测分析']" />

    <Filter />

    <Forcast />

    <Hot />

  </div>
</template>

<script lang="ts" setup>
import Filter from './components/filter.vue'
import Forcast from './components/forcast.vue';
import Hot from "./components/hot.vue"
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
