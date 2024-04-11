<template>

    <a-menu :style="{ width: '220px', height: '100%' }" :default-open-keys="['0']" :default-selected-keys="['0_2']"
        show-collapse-button breakpoint="xl" @collapse="onCollapse">
        <a-menu-item key="Root" @click="goto('/chat')">
            <template #icon><icon-message></icon-message></template>
            行业聊天
        </a-menu-item>
        <a-menu-item key="2">
            <template #icon><icon-bar-chart></icon-bar-chart></template>
            预测分析
        </a-menu-item>
        <a-menu-item key="3">
            <template #icon><icon-user></icon-user></template>
            个人中心
        </a-menu-item>
        <a-menu-item key="4">
            <template #icon><icon-settings></icon-settings></template>
            公司管理
        </a-menu-item>

    </a-menu>
</template>
<script lang="ts" setup>
// import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store'

const router = useRouter();
const appStore = useAppStore()


// menu collapse event
const onCollapse = (val:boolean) => {
    appStore.setMenuCollapsed(val);
}

// jump
const goto = (url:string)=>{
    console.log(url)
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