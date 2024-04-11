<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">重置密码</div>
    <div class="login-form-sub-title"></div>
    <div class="login-form-error-msg"></div>
    <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
      <a-form-item field="loginPhone" :rules="[{ required: true, message: '手机号不能为空' }]"
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
            <a-button type="text">获取验证码</a-button>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="password" :rules="[{ required: true, message: '密码不能为空' }]"
        :validate-trigger="['change', 'blur']" hide-label>
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { useUserStore } from '@/store';
import useLoading from '@/hooks/loading';
// import type { LoginData } from '@/api/user';

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const userStore = useUserStore();

// 是否统一用户协议
const isAgree = ref(true)

// user info
const userInfo = reactive({
  loginPhone: "",
  loginCode: "",
  password: "",
});

// 跳转登录
const handleLogin = () => {
  router.push({
    name: 'login'
  })
}

// 提交
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
      // await userStore.login(values as LoginData);
      // const { redirect, ...othersQuery } = router.currentRoute.value.query;
      // router.push({
      //   name: (redirect as string) || 'ChatIndex',
      //   query: {
      //     ...othersQuery,
      //   },
      // });
      Message.success('提交成功');
      // const { rememberPassword } = loginConfig.value;
    } catch (err) {
      errorMessage.value = (err as Error).message;
    } finally {
      setLoading(false);
    }
  }
};

// 设置是否统一用户协议
const setIsAgree = (value: boolean) => {
  isAgree.value = value;
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
    justify-content: start;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}
</style>
