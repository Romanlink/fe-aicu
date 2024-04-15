<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">重置密码</div>
    <div class="login-form-sub-title"></div>
    <div class="login-form-error-msg"></div>
    <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
      <a-form-item field="loginPhone"
        :rules="[{ required: true, message: '请输入手机号' }, { required: true, validator: loginPhoneValidate }]"
        :validate-trigger="['change', 'blur']" hide-label>
        <a-input :max-length="11" v-model="userInfo.loginPhone" placeholder="请输入手机号">
          <template #prefix>
            <icon-mobile />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="loginCode" :rules="[{ required: true, message: '验证码不能为空' }]"
        :validate-trigger="['change', 'blur']" hide-label>
        <a-input :max-length="6" v-model="userInfo.loginCode" placeholder="请输入短信验证码">
          <template #prefix>
            <icon-safe />
          </template>
          <template #append>
            <a-button v-if="!isSend" type="text" @click="getCode" :loading="sendCodeLoading">获取验证码</a-button>
            <a-button v-else type="text" disabled>{{ `${sendTime}秒后重试` }}</a-button>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="password" :rules="[{ required: true, message: '密码不能为空' }, { minLength: 6, message: '6-18位密码，字母数字组合' }, { maxLength: 18, message: '6-18位密码，字母数字组合' }, {
        validator: passwordValidate,
      }]" :validate-trigger="['change', 'blur']" hide-label>
        <a-input-password v-model="userInfo.password" placeholder="请输入6-18位密码，字母数字组合" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">

        <a-button type="primary" html-type="submit" long :loading="loading">
          提交
        </a-button>
        <a-button type="text" long class="login-form-register-btn" @click="handleLogin">
          已有账号，立即登录
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { useUserStore } from '@/store';
import useLoading from '@/hooks/loading';
import { resetPassword } from '@/api/user'
import { isMobile } from '@/utils/index'
import { sendSmsCode } from '@/api/common';
import CryptoJS from 'crypto-js'

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const userStore = useUserStore();

const isSend = ref(false) // 验证码是否发送
const timer = ref() // 验证码定时器
const sendTime = ref(60) // 验证码发送时间间隔
let sendCodeLoading = ref(false) //

// user info
const userInfo = reactive({
  loginPhone: "",
  loginCode: "",
  password: "",
});

// phone validate
const loginPhoneValidate = (value: any, callback: any) => {
  if (!isMobile(value)) {
    callback('请输入正确格式的手机号')
  }
}

// password validate
const passwordValidate = (value: any, callback: any) => {
  const regex = /^[A-Za-z0-9]+$/
  if (value && !regex.test(value)) {
    callback('6-18位密码，字母数字组合')
  }
}

/**
 * 获取验证码
 * @params {string} 手机号码
 * @return 校验手机号并获取手机验证码
  */
const getCode = () => {

  if (sendCodeLoading.value) return

  if (!isMobile(userInfo.loginPhone)) {
    Message.warning('请输入正确格式的手机号')
    return
  }

  sendCodeLoading.value = true

  sendSmsCode({
    loginPhone: userInfo.loginPhone,
    "optType": "rest"
  }).then((res) => {
    Message.success('验证码发送成功')
    isSend.value = true
    timer.value = setInterval(() => {
      if (sendTime.value > 1) {
        sendTime.value -= 1
      } else {
        sendTime.value = 60
        isSend.value = false
        clearInterval(timer.value)
      }
    }, 1000)
  }).finally(() => {
    sendCodeLoading.value = false
  })
}

// 跳转登录
const handleLogin = () => {
  router.push({
    name: 'login'
  })
}

/**
 * 提交
 * @param param0 
 */
const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      const md5Hash = CryptoJS.MD5(values.password).toString()
      resetPassword({
        loginPhone: values.loginPhone,
        loginCode: values.loginCode,
        password: md5Hash
      }).then((res: any) => {
        console.log(res)
        if (!res) return
        Message.success('操作成功')
        router.push('/login')
      }).finally(() => {
        setLoading(false);
      })
    } catch (err) {
      errorMessage.value = (err as Error).message;
    } finally {
    }
  }
};

onBeforeUnmount(() => {
  clearInterval(timer.value)
})



</script>

<style lang="less" scoped>
.login-form {
  &-wrapper {
    width: 320px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: start;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}
</style>
