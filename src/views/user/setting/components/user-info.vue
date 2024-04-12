<template>
  <a-modal v-model:visible="visible" width="350px" title="修改昵称" @cancel="handleCancel" @before-ok="handleBeforeOk">
    <a-form :model="form" :label-col-props="{ span: 0 }" :wrapper-col-props="{ span: 24 }">
      <a-form-item field="name" label="">
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
      post: ''
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
