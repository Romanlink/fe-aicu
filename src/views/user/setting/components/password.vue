<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }">
    <a-form-item field="oldPassword" label="旧密码" :rules="[
      {
        required: true,
        message: '请输入旧密码',
      },
      { minLength: 6, message: '6-18位密码，字母数字组合' },
      { maxLength: 18, message: '6-18位密码，字母数字组合' },
      {
        validator: passwordValidate,
      }
    ]">
      <a-input-password v-model="formData.oldPassword" :min-length="6" :max-length="18" placeholder="请输入旧密码"
        allow-clear>
      </a-input-password>
    </a-form-item>

    <a-form-item field="newPassword" label="新密码" :rules="[
      {
        required: true,
        message: '请输入新密码',
      },
      { minLength: 6, message: '6-18位密码，字母数字组合' },
      { maxLength: 18, message: '6-18位密码，字母数字组合' },
      {
        validator: passwordValidate,
      }
    ]">
      <a-input-password v-model="formData.newPassword" :min-length="6" :max-length="18" placeholder="请输入新密码"
        allow-clear>
      </a-input-password>
    </a-form-item>

    <a-form-item field="rePassword" label="确认密码" :rules="[
      {
        required: true,
        message: '请再次输入密码',
      },
      { minLength: 6, message: '6-18位密码，字母数字组合' },
      { maxLength: 18, message: '6-18位密码，字母数字组合' },
      {
        validator: passwordValidate,
      },
      {
        validator: passwordConfirm,
      }
    ]">
      <a-input-password v-model="formData.rePassword" :min-length="6" :max-length="18" placeholder="请再次输入密码"
        allow-clear>
      </a-input-password>
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" :loading="loading" @click="validate">
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
import { ref, reactive } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { modifyPass } from '@/api/user'
import useLoading from '@/hooks/loading';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js'

interface IForms {
  oldPassword: string
  newPassword: string
  rePassword: string
}

const { loading, setLoading } = useLoading();

const router = useRouter();

const formRef = ref<FormInstance>();
const formData = reactive<IForms>({
  oldPassword: '',
  newPassword: '',
  rePassword: ''
});

// password validate
const passwordValidate = (value: any, callback: any) => {
  const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/
  if (value && !regex.test(value)) {
    callback('6-18位密码，字母数字组合')
  }
}

// password validate
const passwordConfirm = (value: any, callback: any) => {
  if (value !== formData.newPassword) {
    callback('两次密码不一致，请重新输入')
  }
}

// 提交
const validate = async () => {
  const res = await formRef.value?.validate();
  if (!res) {

    setLoading(true)

    modifyPass({
      oldPassword: CryptoJS.MD5(formData.oldPassword).toString(),
      newPassword: CryptoJS.MD5(formData.newPassword).toString(),
      rePassword: CryptoJS.MD5(formData.rePassword).toString(),
    }).then((res) => {
      if (!res) return
      Message.success('修改成功')
      localStorage.AuthToken = ''
      localStorage.userInfo = ''
      router.push('/login')

    }).finally(() => {
      setLoading(false)
    })
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
