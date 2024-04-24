<template>
  <div class="arco-container">
    <Breadcrumb :items="['公司管理']" />
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <CompanyPanel />
      </a-col>
    </a-row>
    <a-row class="wrapper">
      <a-col :span="24" style="padding: 0 16px 0 0">
        <a-tabs default-active-key="1">
          <template #extra>
            <template v-if="userInfo.status == 1">
              <a-button type="primary" @click="handeAddStaff" :disabled="canBind == 0">添加员工</a-button>
              <div class="ml-3">还可添加 {{ userInfo.canBindNumber }} 人</div>
            </template>
            <template v-else>
              <a-button type="primary" disabled>添加员工</a-button>
              <div class="ml-3">您当前为试用版，无法添加员工</div>
            </template>
          </template>
          <a-tab-pane key="1" title="员工管理">
            <StaffList ref="staffListRef" />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>

    <AddStaff ref="addStaffRef" @getAccountList="getAccountList" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/store';

import CompanyPanel from './components/company-panel.vue';
import StaffList from './components/staff-list.vue'
import AddStaff from './components/add-staff.vue'

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo)

const { canBindNumber } = userInfo.value

const canBind = ref()
if (canBindNumber) {
  canBind.value = canBindNumber.split('/')[0]
}

watch(() => userInfo.value, (val) => {
  if (val && val.canBindNumber) {
    canBind.value = val.canBindNumber.split('/')[0]
  }
})

// 添加员工
const addStaffRef = ref(null)
const staffListRef = ref(null)

// 添加员工
const handeAddStaff = () => {
  if (addStaffRef?.value) {
    addStaffRef.value.handleShow()
  }
}

const getAccountList = () => {
  if (staffListRef?.value) {
    staffListRef.value.getAccountList()
  }
}

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
