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
          <span v-if="data.label === '手机号码'">{{ encryptPhoneNumber(value) }}</span>

          <span v-else-if="data.label === '昵称'"><template v-if="userInfo.nickName === userInfo.loginPhone">
              {{ encryptPhoneNumber(userInfo.loginPhone) }}
            </template>
            <template v-else>
              {{ value || encryptPhoneNumber(userInfo.loginPhone) }}
            </template>
            <a-button type="text" class="ml-10" @click="handleEdit">修改</a-button>
          </span>
          <span v-else-if="data.label === '注册时间'">{{ value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
          <span v-else>
            {{ value }}
          </span>
        </template>
      </a-descriptions>
    </a-space>

    <UserInfoEdit ref="userInfoEditRef" />
  </a-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type {
  FileItem,
  RequestOption,
} from '@arco-design/web-vue/es/upload/interfaces';
// import { userUploadApi } from '@/api/user-center';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import UserInfoEdit from './user-info-edit.vue'
import { useUserStore } from '@/store';
import defaultAvatar from '@/assets/avatar.jpg'
import moment from 'moment'
import { imageUploadApi, imageViewApi } from '@/api/common'
import { modifyPass } from '@/api/user'
import { Message } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';

const userInfoEditRef = ref(null)

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo)

const renderData = computed(() => [
  {
    label: '手机号码',
    value: userInfo.value.loginPhone,
  },
  {
    label: '昵称',
    value: userInfo.value.nickName,
  },
  {
    label: '账号ID',
    value: userInfo.value.account,
  },
  {
    label: '注册时间',
    value: userInfo.value.regTime,
  },
] as DescData[])

const { loading, setLoading } = useLoading();

// 修改昵称
const handleEdit = () => {
  if (userInfoEditRef?.value) {
    userInfoEditRef?.value.handleShow(userInfo.value.nickName)
  }
}

// 加密手机号
const encryptPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
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
