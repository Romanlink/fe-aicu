<template>
  <a-modal v-model:visible="visible" width="350px" title="修改昵称" @cancel="handleCancel" @before-ok="handleBeforeOk">
    <a-form :model="form" :label-col-props="{ span: 0 }" :wrapper-col-props="{ span: 24 }">
      <a-form-item field="nickName" label="">
        <a-input v-model="form.nickName" placeholder="请输入昵称" show-word-limit :max-length="10" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { accountEdit } from '@/api/user'
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const visible = ref(false);

const form = reactive({
  nickName: '',
});

const handleBeforeOk = async (done: any) => {
  if (!form.nickName) {
    Message.warning('请输入昵称')
    done()
    return false
  }

  const res = await accountEdit({ nickName: form.nickName })
  if (res) {
    userStore.updateUserInfo({ nickName: form.nickName })
    Message.success('修改成功')
    visible.value = false
  }

};

// 显示
const handleShow = (nickName: string) => {
  form.nickName = nickName
  visible.value = true;
};

// 隐藏
const handleCancel = () => {
  visible.value = false;
}

defineExpose({ handleShow })
</script>
