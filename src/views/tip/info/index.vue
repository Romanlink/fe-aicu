<template>
  <div class="arco-container">
    <div class="wrapper">
      <div class="title">欢迎使用 AI PRO</div>
      <div class="desc">补充一下您的公司名称或者等待管理员将您加入再进入首页吧～</div>
      <a-input :style="{ width: '320px' }" :max-length="50" v-model="orgName" placeholder="请输入公司名称" size="large"
        class="company-input" allow-clear />
      <template v-if="isShowAlert">
        <a-alert type="error" class="alert">{{ alertMsg }}</a-alert>
      </template>
      <a-button type="primary" :style="{ width: '160px' }" size="large" :loading="loading" class="submit-btn"
        @click="handleSubmit">
        进入首页
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { addCompany, accountInfo } from '@/api/user'
import { Message } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
import { useUserStore } from '@/store';

const router = useRouter();
const userStore = useUserStore();

const isShowAlert = ref<boolean>(false) // 提示框是否显示
const alertMsg = ref('') // 提示信息
const orgName = ref('') // 企业名称

const { loading, setLoading } = useLoading();

// 提交
const handleSubmit = () => {
  console.log(orgName.value)
  if (!orgName.value) {
    Message.warning('公司名称不能为空')
    return
  }

  setLoading(true)
  addCompany({
    orgName: orgName.value
  }).then((res: any) => {
    console.log(res)
    if (!res) return
    if (res.orgName) {
      userStore.updateUserInfo({ orgName: orgName.value })
      getAccountInfo()

    } else if (res.message && !res.success) {
      isShowAlert.value = !isShowAlert.value
      alertMsg.value = res.message
    }
  }).finally(() => {
    setLoading(false)
  })
  // isShowAlert.value = !isShowAlert.value
}

// 获取用户信息
const getAccountInfo = async () => {
  try {
    accountInfo({}).then(res => {
      if (!res) return
      userStore.updateUserInfo(res)
      Message.success('操作成功')
      router.push('/')
    }).finally(() => {
      setLoading(false)
    })
  } catch {
    setLoading(false)
  }

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
