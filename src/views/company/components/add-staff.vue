<template>
  <a-modal v-model:visible="visible" width="400px" title="添加员工" @cancel="handleCancel" @before-ok="handleBeforeOk">
    <a-alert style="margin:0 0 30px">添加完成后如该员工未注册初始密码会短信发送到员工手机号上，请该员工及时修改</a-alert>
    <a-form ref="formRef" :model="form">
      <a-form-item field="loginPhone" label="手机号"
        :rules="[{ required: true, message: '请输入手机号' }, { required: true, validator: loginPhoneValidate }]"
        :validate-trigger="['input', 'blur']">
        <a-input v-model="form.loginPhone" placeholder="请输入手机号" show-word-limit :max-length="11" />
      </a-form-item>

      <a-form-item field="nickName" label="昵称" :rules="[{ required: true, message: '请输入昵称' }]">
        <a-input v-model="form.nickName" placeholder="请输入昵称" show-word-limit :max-length="10" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref, defineEmits } from 'vue';
import { accountBindApi } from '@/api/user'
import { Message } from '@arco-design/web-vue';
import { isMobile } from '@/utils/index'

const visible = ref(false);
const formRef = ref<FormInstance>();
const emit = defineEmits(['getAccountList']);

const form = reactive({
  nickName: '',
  loginPhone: ''
});

// phone validate
const loginPhoneValidate = (value: any, callback: any) => {
  if (!isMobile(value)) {
    callback('请输入正确格式的手机号')
  }
}

// 提交
const handleBeforeOk = async (done) => {
  const res = await formRef.value?.validate();
  if (!res) {
    const bindRes = await accountBindApi(form)
    if (bindRes) {
      emit('getAccountList')
      await formRef.value?.resetFields();
      Message.success('添加成功')
      done()
    } else {
      return false
    }
  } else {
    return false
  }
};

// 显示
const handleShow = () => {
  visible.value = true;
};

// 隐藏
const handleCancel = () => {
  visible.value = false;
}

defineExpose({ handleShow })
</script>
