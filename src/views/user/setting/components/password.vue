<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }">
    <a-form-item field="oldPassword" label="旧密码" :rules="[
      {
        required: true,
        message: '请输入旧密码',
      },
    ]">
      <a-input v-model="formData.oldPassword" placeholder="请输入旧密码" />
    </a-form-item>

    <a-form-item field="newPassword" label="新密码" :rules="[
      {
        required: true,
        message: '请输入新密码',
      },
    ]">
      <a-input v-model="formData.newPassword" placeholder="请输入新密码" />
    </a-form-item>

    <a-form-item field="newPasswordConfirm" label="确认密码" :rules="[
      {
        required: true,
        message: '请再次输入密码',
      },
    ]">
      <a-input v-model="formData.newPasswordConfirm" placeholder="请再次输入密码" />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          保存
        </a-button>
        <a-button type="secondary" @click="reset">
          重置
        </a-button>
      </a-space>
    </a-form-item>

  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';

interface IForms {
  oldPassword: string
  newPassword: string
  newPasswordConfirm: string
}

const formRef = ref<FormInstance>();
const formData = ref<IForms>({
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: ''
});
const validate = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    // do some thing
    // you also can use html-type to submit
  }
};
const reset = async () => {
  await formRef.value?.resetFields();
};
</script>

<style scoped lang="less">
.form {
  width: 540px;
  margin: 0 auto;
}
</style>
