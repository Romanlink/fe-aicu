<template>
  <div class="banner">
    <div class="banner-inner">
      <a-carousel class="carousel" animation-name="fade">
        <a-carousel-item v-for="item in carouselItem" :key="item.slogan">
          <div :key="item.slogan" class="carousel-item">
            <div class="carousel-title">{{ item.slogan }}</div>
            <div class="carousel-sub-title">{{ item.subSlogan }}</div>
            <img class="carousel-image" :src="item.image" />
          </div>
        </a-carousel-item>
      </a-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import bannerImage from '@/assets/images/login-banner.png';
import { Notification } from '@arco-design/web-vue';

const { t } = useI18n();
const carouselItem = computed(() => [
  {
    slogan: '为钢铁行业打造的AI数据智能工具',
    subSlogan: '通过全网数据分析市场动态，提高投资回报率',
    image: bannerImage,
  },
]);

onMounted(() => {
  Notification.clear()
})
</script>

<style lang="less" scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: center;

  &-inner {
    flex: 1;
    height: 100%;
  }
}

.carousel {
  height: 100%;

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  &-title {
    color: var(--color-fill-1);
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }

  &-sub-title {
    margin-top: 8px;
    color: var(--color-text-3);
    font-size: 14px;
    line-height: 22px;
  }

  &-image {
    width: 320px;
    margin-top: 30px;
  }
}
</style>
