<template>
  <a-modal v-model:visible="visible" width="400px" title="添加员工" @cancel="handleCancel" @before-ok="handleBeforeOk">
    <a-alert style="margin:0 0 30px">添加完成后如该员工未注册初始密码会短信发送到员工手机号上，请该员工及时修改</a-alert>
    <a-form :model="form">
      <a-form-item field="mobile" label="手机号" validate-trigger="input" required>
        <a-input v-model="form.mobile" placeholder="请输入手机号" show-word-limit :max-length="11" />
      </a-form-item>

      <a-form-item field="name" label="昵称">
        <a-input v-model="form.name" placeholder="请输入昵称" show-word-limit :max-length="10" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { reactive, ref } from 'vue';

export default {
  setup() {
    const visible = ref(false);
    const form = reactive({
      name: '',
      mobile: ''
    });

    const handleShow = () => {
      visible.value = true;
    };
    
    const handleBeforeOk = (done) => {
      console.log(form)
      window.setTimeout(() => {
        done()
        // prevent close
        // done(false)
      }, 3000)
    };
    const handleCancel = () => {
      visible.value = false;
    }

    return {
      visible,
      form,
      handleShow,
      handleBeforeOk,
      handleCancel
    }
  },
}
</script>
