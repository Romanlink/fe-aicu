<template>
  <div class="arco-container">
    <div class="wrapper">
      <div class="title">欢迎使用 AI PRO</div>
      <div class="desc">补充一下您的公司名称或者等待管理员将您加入再进入首页吧～</div>
      <a-input :style="{ width: '320px' }" placeholder="请输入公司名称" size="large" class="company-input" allow-clear  />
      <template v-if="isShowAlert">
        <a-alert  type="error" class="alert">公司名称不能为空/您的公司名称已被注册，请联系该公司管理员18600000000加入</a-alert>
      </template>
      <a-button type="primary" :style="{ width: '160px' }" size="large" class="submit-btn" @click="handleSubmit">
        进入首页
      </a-button>
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
  .alert,
  .company-input {
    margin: 20px 0 0;
  }

  .alert {
    width: auto;
  }

  .submit-btn {
    margin: 80px 0 0;
  }
}

:deep(.section-title) {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
