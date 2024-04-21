<template>
  <a-modal v-model:visible="visible" width="350px" title="修改公司名称" @cancel="handleCancel" @before-ok="handleBeforeOk">
    <a-form :model="form" :label-col-props="{ span: 0 }" :wrapper-col-props="{ span: 24 }">
      <a-form-item field="orgName" label="">
        <a-textarea v-model="form.orgName" placeholder="请输入公司名，50个字内" allow-clear show-word-limit :max-length="50" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { orgEditApi } from '@/api/user'
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const visible = ref(false);
const form = reactive({
  orgName: '',
});

const handleBeforeOk = async (done) => {
  if (!form.orgName) {
    Message.warning('请输入企业名称')
    done()
    return
  }

  const res = await orgEditApi({ orgName: form.orgName })
  if (res) {
    userStore.updateUserInfo({ orgName: form.orgName })
    Message.success('修改成功')
    visible.value = false
  }

};

const handleShow = (orgName: string) => {
  form.orgName = orgName
  visible.value = true;
};

const handleCancel = () => {
  visible.value = false;
}

defineExpose({ handleShow })
</script>
