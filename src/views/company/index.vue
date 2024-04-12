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
            <a-button type="primary" @click="handeAddStaff">添加员工</a-button>
          </template>
          <a-tab-pane key="1" title="员工管理">
            <StaffList />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>

    <AddStaff ref="addStaffRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import CompanyPanel from './components/company-panel.vue';
import StaffList from './components/staff-list.vue'
import AddStaff from './components/add-staff.vue'

// 添加员工
const addStaffRef = ref(null)

// 添加员工
const handeAddStaff = () => {
  if (addStaffRef?.value) {
    addStaffRef.value.handleShow()
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
