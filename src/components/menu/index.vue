<template>

    <a-menu :style="{ width: '220px', height: '100%' }" :default-selected-keys="selectKeys" show-collapse-button
        breakpoint="xl" @collapse="onCollapse">

        <a-menu-item v-for="(menu) in menus" :key="menu.key" @click="goto(menu.url, menu.key)">
            <template #icon>
                <icon-message v-if="menu.key === '1'"></icon-message>
                <icon-bar-chart v-if="menu.key === '2'"></icon-bar-chart>
                <icon-user v-if="menu.key === '3'"></icon-user>
                <icon-settings v-if="menu.key === '4'"></icon-settings>
            </template>
            {{ menu.title }}
        </a-menu-item>

    </a-menu>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/store'

const router = useRouter();
const route = useRoute()
const appStore = useAppStore()

interface IMenus {
    key: string
    url: string
    urlKey: string
    icon: string
    title: string
}

// menus
const menus = ref<IMenus[]>([{
    key: '1',
    url: '/chat',
    urlKey: 'chat',
    icon: 'icon-message',
    title: '行业聊天'
}, {
    key: '2',
    url: '/forcast',
    urlKey: 'forcast',
    icon: 'icon-bar-chart',
    title: '预测分析'
}, {
    key: '3',
    url: '/user',
    urlKey: 'user',
    icon: 'icon-user',
    title: '个人中心'
}, {
    key: '4',
    url: '/company',
    urlKey: 'company',
    icon: 'icon-settings',
    title: '公司管理'
}
])

// active key
const selectKeys = ref<string[]>(['1'])

watch(
    route,
    (val) => {
        const { path } = route
        menus.value.forEach((menu) => {
            if (path.includes(menu.urlKey)) {
                selectKeys.value = [menu.key]
            }
        })
    },
    {
        immediate: true,
        flush: 'post',
    },
)

// menu collapse event
const onCollapse = (val: boolean) => {
    appStore.setMenuCollapsed(val);
}

// jump
const goto = (url: string, key: string) => {
    router.push(url)
}

</script>
<style scoped>
.menu-demo {
    box-sizing: border-box;
    width: 100%;
    height: 600px;
    padding: 40px;
    background-color: var(--color-neutral-2);
}
</style>