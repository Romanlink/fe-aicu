<template>
  <a-table :columns="columns" :data="data" :loading="loading">
    <template #regTime="{ record }">
      <template v-if="record.regTime">{{ moment(record.regTime).format('YYYY-MM-DD HH:mm:ss') }}</template>
      <template v-else>-</template>
    </template>
    <template #type="{ record }">
      <template v-if="record.type == 1">公司管理员</template>
      <template v-else>员工</template>
    </template>
    <template #action="{ record }">
      <a-button type="text" v-if="record.type != 1" style="margin: 0 10px 0 0"
        @click="openAdminModal(record)">提升为管理员</a-button>
      <a-button type="text" @click="openQuitModal(record)">退出公司</a-button>
    </template>
  </a-table>
  <a-modal v-model:visible="adminVisible" width="450px" title="提升为管理员" @cancel="adminVisible = false"
    @before-ok="handleAddAdmin">
    <a-alert>每个公司只能有一个管理员，提升手机号<strong class="mx-1" v-if="selectData && selectData.loginPhone">{{ selectData.loginPhone
        }}</strong>为管理员后，您将降级成为员工，点击确定会退出系统重新登录。</a-alert>
  </a-modal>
  <a-modal v-model:visible="quitVisible" width="450px" title="退出公司" @cancel="quitVisible = false"
    @before-ok="handleQuitCompany">
    <a-alert>手机号<strong class="mx-1" v-if="selectData && selectData.loginPhone">{{ selectData.loginPhone
        }}</strong>退出公司后重新加入一家公司才能使用该系统，点击确定会强制退出系统。</a-alert>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { accountListApi } from '@/api/user'
import useLoading from '@/hooks/loading';
import moment from 'moment'
import { accountUpApi, accountUnbindApi } from '@/api/user'
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

const { loading, setLoading } = useLoading();

const router = useRouter();

// columns config
const columns = ref([
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '手机号',
    dataIndex: 'loginPhone',
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
  },
  {
    title: '添加时间',
    dataIndex: 'regTime',
    slotName: 'regTime',
  },
  {
    title: '角色',
    dataIndex: 'type',
    slotName: 'type'
  },
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 300
  },
])

// source data
const data = ref<any>([])
const selectData = ref<any>()

const adminVisible = ref<boolean>(false) // 提升为管理员
const quitVisible = ref<boolean>(false) // 退出公司

// 打开提升为管理员弹窗
const openAdminModal = (record: any) => {
  selectData.value = record
  adminVisible.value = true
}

// 提升为管理员
const handleAddAdmin = async (done: any) => {
  const res = await accountUpApi({ id: selectData.value.id })
  if (res) {
    Message.success('操作成功')
    done()
    localStorage.AuthToken = ''
    localStorage.userInfo = ''
    router.push('/login')
  } else {
    return false
  }
}

// 打开退出公司弹窗
const openQuitModal = (record: any) => {
  selectData.value = record
  quitVisible.value = true
}

// 退出公司
const handleQuitCompany = async (done: any) => {
  const res = await accountUnbindApi({ id: selectData.value.id })
  if (res) {
    Message.success('操作成功')
    done()
    getAccountList()
  } else {
    return false
  }
}

// fetch account list
const getAccountList = () => {
  setLoading(true)
  accountListApi({}).then((res) => {
    data.value = res || []
  }).finally(() => {
    setLoading(false)
  })
}

onMounted(() => {
  getAccountList()
})

defineExpose({ getAccountList })

</script>
