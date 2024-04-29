<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <img alt="logo" :src="Logo" style="height:30px;" />
        <!-- <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5">
          AI Pro
        </a-typography-title> -->

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
              <img alt="avatar" :src="userInfo.headPicUrl || defaultAvatar" />
            </a-avatar>
            <div class="info">
              <template v-if="userInfo.nickName === userInfo.loginPhone">
                {{ encryptPhoneNumber(userInfo.loginPhone) }}
              </template>
              <template v-else>
                {{ userInfo.nickName || encryptPhoneNumber(userInfo.loginPhone) }}
              </template>
            </div>
            <icon-caret-down />
          </div>

          <template #content>
            <template v-if="!isHideMenu">
              <a-doption>
                <a-space @click="$router.push('/user')">
                  <icon-user />
                  <span>
                    个人中心
                  </span>
                </a-space>
              </a-doption>
              <a-doption v-if="userInfo.type == 1">
                <a-space @click="$router.push('/company')">
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
import { PropType, h } from 'vue';
import { onMounted, computed } from 'vue';
// import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { useFullscreen } from '@vueuse/core';
import defaultAvatar from '@/assets/avatar.jpg'
import { useUserStore } from '@/store';
import { Notification } from '@arco-design/web-vue';
import Logo from '@/assets/images/logo.png'
import { imageViewApi } from '@/api/common'


const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo)

const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

const router = useRouter();

// 加密手机号
const encryptPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

// 下载头像
const downloadHeadPic = async () => {
  const { headPic, headPicUrl } = userInfo.value
  if (headPic && !headPicUrl) {
    const imageData: any = await imageViewApi({ imageKey: headPic })

    if (imageData && imageData.image) {
      const headPicUrl = 'data:image/jpeg;base64,' + imageData.image
      userStore.updateUserInfo({
        headPicUrl
      })
    }
  } else if (headPic && headPicUrl) {
    userStore.updateUserInfo({
      headPicUrl: headPicUrl
    })
  } else {
    {
      userStore.updateUserInfo({
        headPicUrl: ''
      })
    }
  }
}

onMounted(() => {
  downloadHeadPic()
  const { status } = userInfo.value
  if (status !== 1) {
    Notification.clear()
    Notification.warning({
      title: '当前为试用版',
      content: () => {
        return h('div', {}, [h('div', '联系商务开通正式版'), h('div', '18633841933'),])
      },
      position: "bottomLeft",
      duration: 365 * 24 * 60 * 60 * 1000,
      // closable: false,
      style: { width: '240px', left: 0 },
      closable: true,
    })
  }
})

defineProps({
  isHideMenu: {
    type: Boolean as PropType<boolean>,
    default() {
      return false;
    },
  },
});

const handleLogout = () => {
  localStorage.AuthToken = ''
  localStorage.userInfo = ''
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
