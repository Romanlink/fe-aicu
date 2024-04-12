<template>
  <div class="arco-container">
    <Breadcrumb :items="['预测分析']" />
    <a-row class="wrapper">
      <a-col :span="24">
        
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
</script>

<script lang="ts">
  export default {
    name: 'Setting',
  };
</script>

<style scoped lang="less">
  .arco-container {
    padding: 0 16px 16px 16px;
  }

  .wrapper {
    padding: 16px 0 0 16px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
