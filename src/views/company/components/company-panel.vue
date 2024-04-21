<template>
  <a-card :bordered="false">
    <a-space :size="54">
      <a-spin :loading="loading">
        <a-upload :custom-request="handleUpload" accept="image/png, image/jpeg" list-type="picture-card"
          :file-list="fileList" :show-upload-button="true" :show-file-list="false">
          <template #upload-button>
            <a-avatar :size="100" class="info-avatar">
              <template #trigger-icon>
                <icon-camera />
              </template>
              <img v-if="fileList.length" :src="fileList[0].url" />
            </a-avatar>
          </template>
        </a-upload>
      </a-spin>
      <a-descriptions :data="renderData" :column="1" size="medium">
        <template #label="{ label }">{{ label }} :</template>
        <template #value="{ value, data }">
          <span>{{ value }}</span>
          <a-button v-if="data.label === '公司名称'" type="text" class="ml-10" @click="handleEdit">修改</a-button>
        </template>
      </a-descriptions>
    </a-space>

    <CompanyInfo ref="companyInfoRef" />
  </a-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type {
  FileItem,
  RequestOption,
} from '@arco-design/web-vue/es/upload/interfaces';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { useUserStore } from '@/store';
import { imageUploadApi, imageViewApi } from '@/api/common'
import defaultAvatar from '@/assets/avatar.jpg'
import { Message } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
import CompanyInfo from './company-info.vue'

const companyInfoRef = ref(null)
const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo)
const { loading, setLoading } = useLoading();

// data
const renderData = computed(() => [
  {
    label: '公司名称',
    value: userInfo.value.orgName,
  }
] as DescData[])

// 修改昵称
const handleEdit = () => {
  if (companyInfoRef?.value) {
    companyInfoRef.value.handleShow(userInfo.value.orgName)
  }
}

// 头像
const file = {
  uid: '-2',
  name: 'avatar.png',
  url: userInfo.value.headPicUrl || defaultAvatar,
};
const fileList = ref<FileItem[]>([file]);

// 上传头像
const handleUpload = async (options: RequestOption) => {

  if (loading.value) return

  setLoading(true)

  const {
    fileItem,
    name = 'file',
  } = options;
  const formData = new FormData();

  formData.append(name as string, fileItem.file as Blob);

  // 上传头像
  const imageKey: any = await imageUploadApi(formData);
  if (!imageKey) {
    setLoading(false)
    return
  }

  // 更新头像
  // const user = await modifyPass({ headPic: imageKey })
  // if (!user) {
  //   setLoading(false)
  //   return
  // }

  // 下载头像
  const imageData: any = await imageViewApi({ imageKey })

  if (imageData && imageData.image) {
    const headPicUrl = 'data:image/jpeg;base64,' + imageData.image
    userStore.updateUserInfo({
      headPic: imageKey,
      headPicUrl
    })
    fileList.value = [fileItem];
    Message.success('修改成功')
  }

  setLoading(false)

};
</script>

<style scoped lang="less">
.arco-card {
  padding: 14px 0 4px 4px;
  border-radius: 4px;
}

:deep(.arco-avatar-trigger-icon-button) {
  width: 32px;
  height: 32px;
  line-height: 32px;
  background-color: #e8f3ff;

  .arco-icon-camera {
    margin-top: 8px;
    color: rgb(var(--arcoblue-6));
    font-size: 14px;
  }
}
</style>
