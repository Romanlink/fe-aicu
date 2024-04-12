<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useRouter } from 'vue-router'
import Sider from './sider/index.vue'
import Permission from './Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useAuthStore, useChatStore } from '@/store'
import NavBar from '@/components/navbar/index.vue';
import Menu from '@/components/menu/index.vue'
const isInit = ref(false);

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

router.replace({ name: 'Chat', params: { uuid: chatStore.active } })

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const needPermission = computed(() => !!authStore.session?.auth && !authStore.token)

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[260px]': !isMobile.value && !collapsed.value },
  ]
})

const navbarHeight = `60px`;
const navbar = ref(true)

const menuCollapse = computed(() => {
  return appStore.menuCollapse;
});
const menuWidth = computed(() => {
  return appStore.menuCollapse ? 48 : appStore.menuWidth;
});

const paddingStyle = computed(() => {
  const paddingLeft = { paddingLeft: `${menuWidth.value}px` }
  const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {};
  return { ...paddingLeft, ...paddingTop };
});

const setCollapsed = (val: boolean) => {
  if (!isInit.value) return; // for page initialization menu state problem
  appStore.setMenuCollapsed(val);
};
</script>

<template>
  <a-layout class="layout">
    <div class="layout-navbar">
      <NavBar></NavBar>
    </div>
    <a-layout>
      <a-layout>
        <a-layout class="layout-content" :style="paddingStyle">
          <!-- <TabBar v-if="appStore.tabBar" /> -->
          <a-layout-sider class="layout-sider" breakpoint="xl" :collapsed="menuCollapse" :collapsible="true"
            :width="menuWidth" :style="{ paddingTop: navbar ? '60px' : '' }" :hide-trigger="true"
            @collapse="setCollapsed">
            <div class="menu-wrapper">
              <Menu />
            </div>
          </a-layout-sider>
          <a-layout-content>
            <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
              <div class="h-full overflow-hidden" :class="getMobileClass">
                <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
                  <Sider />
                  <NLayoutContent class="h-full">
                    <RouterView v-slot="{ Component, route }">
                      <component :is="Component" :key="route.fullPath" />
                    </RouterView>
                  </NLayoutContent>
                </NLayout>
              </div>
              <Permission :visible="needPermission" />
            </div>
          </a-layout-content>
          <!-- <Footer /> -->
        </a-layout>
      </a-layout>
    </a-layout>
  </a-layout>

</template>

<style scoped lang="less">
@nav-size-height: 60px;
@layout-max-width: 1100px;

.layout {
  width: 100%;
  height: 100%;
}

.layout-navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: @nav-size-height;
}

.layout-sider {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100%;
  transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

  &::after {
    position: absolute;
    top: 0;
    right: -1px;
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
    content: '';
  }

  > :deep(.arco-layout-sider-children) {
    overflow-y: hidden;
  }
}

.menu-wrapper {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;

  :deep(.arco-menu) {
    ::-webkit-scrollbar {
      width: 12px;
      height: 4px;
    }

    ::-webkit-scrollbar-thumb {
      border: 4px solid transparent;
      background-clip: padding-box;
      border-radius: 7px;
      background-color: var(--color-text-4);
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--color-text-3);
    }
  }
}

.layout-content {
  min-height: 100vh;
  overflow-y: hidden;
  background-color: var(--color-fill-2);
  transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}
</style>
