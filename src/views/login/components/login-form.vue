<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">登录图鉴科技</div>
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
      <a-form-item field="password" :min-length="6" :max-length="18"
        :rules="[{ required: true, message: '密码不能为空' }, { minLength: 6, message: '6-18位密码' }, { maxLength: 18, message: '6-18位密码' }]"
        :validate-trigger="['change', 'blur']" hide-label>
        <a-input-password v-model="userInfo.password" placeholder="请输入密码" allow-clear>
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
import { accountLogin } from '@/api/user'
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
  password:  loginConfig.value.password || "",
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
    console.log(values)
    try {
      const md5Hash = CryptoJS.MD5(values.password).toString()
      console.log(router.currentRoute.value)
      accountLogin({
        loginPhone: values.loginPhone,
        password: md5Hash
      }).then((res: any) => {
        console.log(res)
        if (!res) return
        if (res && res.token) {
          Message.success('登录成功')
          setStorage('AuthToken', res.token, 60 * 1000)
          setStorage('userInfo', JSON.stringify(res))
          // const { redirect } = router.currentRoute.value;
          console.log(router.currentRoute.value)
          // router.push(redirect || '/')

        } else {
          Message.error('登录错误')
        }
      }).finally(() => {
        const { rememberPassword } = loginConfig.value;
        const { loginPhone, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.loginPhone = rememberPassword ? loginPhone : '';
        loginConfig.value.password = rememberPassword ? password : '';
        setLoading(false);
      })
      // await userStore.login(values as LoginData);
      // const { redirect, ...othersQuery } = router.currentRoute.value.query;
      // router.push({
      //   name: (redirect as string) || 'ChatIndex',
      //   query: {
      //     ...othersQuery,
      //   },
      // });

    } catch (err) {
      errorMessage.value = (err as Error).message;
    } finally {

    }
  }
};
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
