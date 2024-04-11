<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <img alt="logo"
          src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image" />
        <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5">
          AI Pro
        </a-typography-title>

      </a-space>
    </div>
    <div class="center-side">

    </div>
    <ul class="right-side">

      <li>
        <a-tooltip :content="isFullscreen
          ? '点击退出全屏模式'
          : '点击切换全屏模式'
          ">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="toggleFullScreen">
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!-- <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setVisible"
          >
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
      </li> -->
      <li>
        <a-dropdown trigger="click">
          <div class="user-info">
            <a-avatar :size="32" :style="{ marginRight: '8px', cursor: 'pointer' }">
              <img alt="avatar" :src="avatarImg" />
            </a-avatar>
            <div class="info">180****2222</div>
            <icon-caret-down />
          </div>

          <template #content>
            <template v-if="!isHideMenu">
              <a-doption>
                <a-space @click="$router.push({ name: 'user' })">
                  <icon-user />
                  <span>
                    个人中心
                  </span>
                </a-space>
              </a-doption>
              <a-doption>
                <a-space @click="$router.push({ name: 'company' })">
                  <icon-settings />
                  <span>
                    公司管理
                  </span>
                </a-space>
              </a-doption>
            </template>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span>
                  退出登录
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { ref } from 'vue';
// import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { useFullscreen } from '@vueuse/core';
import avatarUrl from '@/assets/images/login-banner.png'

const avatarImg = ref(avatarUrl)
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

const router = useRouter();

defineProps({
  isHideMenu: {
    type: Boolean as PropType<boolean>,
    default() {
      return false;
    },
  },
});

const handleLogout = () => {
  router.push('/login')
};
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.center-side {
  flex: 1;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }

  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }

  .trigger-btn {
    margin-left: 14px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  color: #666;
  cursor: pointer;

  .info {
    margin: 0 5px 0 0;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
