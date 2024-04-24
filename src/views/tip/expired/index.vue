<template>
  <div class="arco-container">
    <div class="wrapper">
      <div class="title">试用到期：欢迎使用数据熊</div>
      <div class="desc">您的试用已到期，联系商务获取正式版本吧～</div>
      <div class="contact">商务手机号：18633841932</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isShowAlert = ref<boolean>(false)

// 提交
const handleSubmit = () => {
  isShowAlert.value = !isShowAlert.value
}
</script>


<style scoped lang="less">
.arco-container {
  padding: 20px 20px 0 20px;
}

.wrapper {
  padding: 20px;
  min-height: calc(100vh - 130px);
  background-color: var(--color-bg-2);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .title {
    font-size: 20px;
    font-weight: 500;
  }

  .desc,
  .contact {
    margin: 50px 0 0;
  }

  .contact {
    font-size: 17px;
  }

}

:deep(.section-title) {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
