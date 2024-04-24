<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">登录数据熊</div>
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
      <a-form-item field="password"
        :rules="[{ required: true, message: '密码不能为空' }, { minLength: 6, message: '6-18位密码' }, { maxLength: 18, message: '6-18位密码' }]"
        :validate-trigger="['change', 'blur']" hide-label>
        <a-input-password :min-length="6" :max-length="18" v-model="userInfo.password" placeholder="请输入密码" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox checked="rememberPassword" :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any">
            记住密码
          </a-checkbox>
          <a-button type="text" class="login-form-register-btn" @click="$router.push('/forgetPassword')">
            忘记密码
          </a-button>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          登录
        </a-button>
        <a-button type="text" long class="login-form-register-btn" @click="handleReg">
          注册账号
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { useUserStore } from '@/store';
import useLoading from '@/hooks/loading';
// import type { LoginData } from '@/api/user';
import { accountLogin, accountInfo } from '@/api/user'
import { imageViewApi } from '@/api/common'
import { isMobile } from '@/utils/index'
import { setStorage } from '@/utils/arco-storage'
import CryptoJS from 'crypto-js'

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const userStore = useUserStore();

const loginConfig = useStorage('login-config', {
  rememberPassword: true,
  loginPhone: '', // 演示默认值
  password: '', // demo default value
});

const userInfo = reactive({
  loginPhone: loginConfig.value.loginPhone || '',
  password: loginConfig.value.password || "",
});

// phone validate
const loginPhoneValidate = (value: any, callback: any) => {
  if (!isMobile(value)) {
    callback('请输入正确格式的手机号')
  }
}

// 注册
const handleReg = () => {
  router.push({
    name: 'register'
  })
}

// 登录
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

      // 登录
      const loginRes: any = await accountLogin({
        loginPhone: values.loginPhone,
        password: md5Hash
      })

      if (!loginRes) return setLoading(false)
      if (!loginRes.token) return Message.error('登录错误')

      // 存token 30分钟
      setStorage('AuthToken', loginRes.token, 30 * 60)

      // 记住密码
      const { rememberPassword } = loginConfig.value;
      const { loginPhone, password } = values;
      loginConfig.value.loginPhone = rememberPassword ? loginPhone : '';
      loginConfig.value.password = rememberPassword ? password : '';

      if (!loginRes.orgId) {
        handleLoginSuccess(loginRes)
      } else {
        // 获取用户信息
        // 未绑定企业，该接口报错
        const userInfo: any = await accountInfo({})
        if (userInfo) {
          handleLoginSuccess(userInfo)
        } else {
          setLoading(false)
        }
      }
    } catch (err) {
      errorMessage.value = (err as Error).message;
    } finally {

    }
  }
};

// 登录成功
const handleLoginSuccess = async (userInfo: any) => {
  setStorage('userInfo', JSON.stringify(userInfo))
  userStore.updateUserInfo(userInfo)

  const { headPic } = userInfo

  // 下载头像
  if (headPic) {
    const imageData: any = await imageViewApi({ imageKey: headPic })

    if (imageData && imageData.image) {
      const headPicUrl = 'data:image/jpeg;base64,' + imageData.image
      userStore.updateUserInfo({
        headPicUrl
      })
    }
  } else {
    userStore.updateUserInfo({
      headPicUrl: ''
    })
  }

  Message.success('登录成功')
  setLoading(false)

  // if (!userInfo.orgId) {
  //   // 未关联企业
  //   router.push('/tip/add-company')
  // } else if (userInfo.trial == 0) {
  //   // 已过试用期
  //   router.push('/tip/expired')
  // } else {
  //   router.push('/')
  // }

  router.push('/')
}


const setRememberPassword = (value: boolean) => {
  loginConfig.value.rememberPassword = value;
};
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
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}
</style>
