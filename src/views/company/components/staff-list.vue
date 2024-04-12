<template>
  <a-table :columns="columns" :data="data">
    <template #role="{ record }">
      <template v-if="record.role == 1">公司管理员</template>
      <template v-if="record.role == 2">员工</template>
    </template>
    <template #action="{ record }">
      <a-button type="text" v-if="record.role == 2" style="margin: 0 10px 0 0" @click="openAdminModal">提升为管理员</a-button>
      <a-button type="text" @click="openQuitModal">退出公司</a-button>
    </template>
  </a-table>
  <a-modal v-model:visible="adminVisible" width="450px" title="提升为管理员" @cancel="adminVisible = false"
    @before-ok="handleAddAdmin">
    <a-alert>每个公司只能有一个管理员，提升手机号<strong>18633841932</strong>为管理员后，您将降级成为员工，点击确定会退出系统重新登录。</a-alert>
  </a-modal>
  <a-modal v-model:visible="quitVisible" width="450px" title="退出公司" @cancel="quitVisible = false"
    @before-ok="handleQuitCompany">
    <a-alert>手机号<strong>1860000000</strong>退出公司后重新加入一家公司才能使用该系统，点击确定会强制退出系统。</a-alert>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

// columns config
const columns = ref([
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
  },
  {
    title: '添加时间',
    dataIndex: 'create_time',
  },
  {
    title: '角色',
    dataIndex: 'role',
    slotName: 'role'
  },
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 300
  },
])

// source data
const data = ref([{
  key: '1',
  index: 1000,
  mobile: 18011112222,
  nickname: "Jack",
  create_time: '2024-04-10 19:00:00',
  role: 1
}, {
  key: '2',
  index: 1001,
  mobile: 18011112223,
  nickname: "Cxl",
  create_time: '2024-04-10 19:00:00',
  role: 2
}])


const adminVisible = ref<boolean>(false) // 提升为管理员
const quitVisible = ref<boolean>(false) // 退出公司

// 打开提升为管理员弹窗
const openAdminModal = () => {
  adminVisible.value = true
}

// 提升为管理员 event
const handleAddAdmin = (done: any) => {
  adminVisible.value = true
  window.setTimeout(() => {
    done()
  }, 2000)
}

// 打开退出公司弹窗
const openQuitModal = () => {
  quitVisible.value = true
}

// 退出公司 event
const handleQuitCompany = (done: any) => {
  quitVisible.value = true
  window.setTimeout(() => {
    done()
    // prevent close
    // done(false)
  }, 2000)
}
</script>
