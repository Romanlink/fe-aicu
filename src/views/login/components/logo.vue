<template>
  <div class="logo">
    <img alt="logo"
      :src="Logo" style="width:120px;" />
    <div class="logo-text"></div>
  </div>
</template>

<script lang="ts" setup>

import Logo from '@/assets/images/logo-white.png'

</script>

<style lang="less" scoped>
.logo {
  position: fixed;
  top: 24px;
  left: 22px;
  z-index: 1;
  display: inline-flex;
  align-items: center;

  &-text {
    margin-right: 4px;
    margin-left: 4px;
    color: var(--color-fill-1);
    font-size: 20px;
  }
}
</style>
