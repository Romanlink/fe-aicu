<script setup lang='ts'>
import { computed, ref, onMounted, watch } from 'vue'
import { NInput, NPopconfirm, NScrollbar } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { debounce } from '@/utils/functions/debounce'
import { getChatListApi, chatDeleteApi, chatEditApi, chatCreateApi } from '@/api/chat'

const { isMobile } = useBasicLayout()

const appStore = useAppStore()
const chatStore = useChatStore()

const loading = ref<boolean>(false)
const dataSources = ref<any[]>([])
// const dataSources = computed(() => chatStore.history)
const activeValue = ref<any>('')

async function handleSelect({ uuid }: Chat.History) {
  if (isActive(uuid))
    return

  if (chatStore.active)
    chatStore.updateHistory(chatStore.active, { isEdit: false })
  await chatStore.setActive(uuid)

  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

async function handleEdit({ uuid }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation()
  // chatStore.updateHistory(uuid, { isEdit })
  const index = dataSources.value.findIndex(item => item.uuid === uuid)
  if (index !== -1) {
    dataSources.value[index].isEdit = isEdit
    // this.recordState()
  }
  if (!isEdit) {
    const { uuid, title } = dataSources.value[index]
    // loading.value = true
    await chatEditApi({ chatId: uuid, title })
    // loading.value = false
  }
}

async function handleDelete(index: number, uuid: number, event?: MouseEvent | TouchEvent) {
  event?.stopPropagation()

  // loading.value = true
  // await chatDeleteApi({ chatId: uuid })
  chatDeleteApi({ chatId: uuid })
  // loading.value = false

  dataSources.value.splice(index, 1)

  if (dataSources.value.length === 0) {
    chatStore.setActive(null)
    chatStore.setDelAll(new Date())
    return
  }

  if (index > 0 && index <= dataSources.value.length) {
    const uuid = dataSources.value[index - 1].uuid
    await chatStore.setActive(uuid)
    await chatStore.reloadRoute(uuid)
    return
  }

  if (index === 0) {
    if (dataSources.value.length > 0) {
      const uuid = dataSources.value[1].uuid
      await chatStore.setActive(uuid)
      await chatStore.reloadRoute(uuid)
    }
  }

  if (index > dataSources.value.length) {
    const uuid = dataSources.value[dataSources.value.length - 1].uuid
    await chatStore.setActive(uuid)
    await chatStore.reloadRoute(uuid)
  }


  // fetchChatList()

  // chatStore.deleteHistory(index)
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

const handleDeleteDebounce = debounce(handleDelete, 600)

async function handleEnter({ uuid }: Chat.History, isEdit: boolean, event: KeyboardEvent) {
  event?.stopPropagation()
  if (event.key === 'Enter') {
    const index = dataSources.value.findIndex(item => item.uuid === uuid)
    if (index !== -1) {
      dataSources.value[index].isEdit = isEdit
      // this.recordState()
    }
    if (!isEdit) {
      const { uuid, title } = dataSources.value[index]
      // loading.value = true
      await chatEditApi({ chatId: uuid, title })
      // loading.value = false
    }
  }
  // chatStore.updateHistory(uuid, { isEdit })
}

function isActive(uuid: number) {
  return chatStore.active == uuid || activeValue.value == uuid
}

const handleAdd = async (data: any) => {
  dataSources.value.unshift({
    isEdit: false,
    uuid: data.chatId,
    title: data.title
  })
  activeValue.value = ''
  await chatStore.setActive(data.chatId)
  await chatStore.reloadRoute(data.chatId)
}

const fetchChatList = async () => {
  loading.value = true
  const data: any = await getChatListApi({})

  data.reverse()

  dataSources.value = data.map((item: any) => {
    return {
      isEdit: false,
      uuid: item.chatId,
      title: item.title
    }
  })

  if (chatStore.active) {
    chatStore.updateHistory(chatStore.active, { isEdit: false })
  } else if (dataSources.value.length) {
    console.log(dataSources.value[0].uuid)
    await chatStore.setActive(dataSources.value[0].uuid)
  }

  loading.value = false
}

watch(() => chatStore.newChat, (oldValue, newValue) => {
  if (localStorage.newChat) {
    dataSources.value.push({
      isEdit: false,
      uuid: '',
      title: localStorage.newChat
    })
  }
})

watch(() => chatStore.newChatId, (newValue, oldVlaue) => {
  activeValue.value = newValue
  dataSources.value.forEach((item: any) => {
    if (item.title == localStorage.newChat && !item.uuid) {
      item.uuid = newValue
    }
  })
})

watch(() => chatStore.newMenu, (newValue, oldVlaue) => {
  if (newValue) {
    const values = newValue.split('_')
    dataSources.value.forEach((item: any) => {
      if (item.uuid == values[0]) {
        item.title = values[1]
      }
    })
  }

})

onMounted(() => {
  fetchChatList()
})

defineExpose({ handleAdd })

</script>

<template>
  <NScrollbar class="px-4">
    <a-spin :loading="loading" style="width:100%;height:500px">
      <div class="flex flex-col gap-2 text-sm">
        <template v-if="!dataSources.length">
          <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
            <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
            <span>{{ $t('common.noData') }}</span>
          </div>
        </template>
        <template v-else>
          <div v-for="(item, index) of dataSources" :key="index">
            <a class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
              :class="isActive(item.uuid) && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]', 'pr-14']"
              @click="handleSelect(item)">
              <span>
                <SvgIcon icon="ri:message-3-line" />
              </span>
              <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
                <NInput v-if="item.isEdit" v-model:value="item.title" size="tiny"
                  @keypress="handleEnter(item, false, $event)" />
                <span v-else>{{ item.title }}</span>
              </div>
              <div v-if="isActive(item.uuid)" class="absolute z-10 flex visible right-1">
                <template v-if="item.isEdit">
                  <button class="p-1" @click="handleEdit(item, false, $event)">
                    <SvgIcon icon="ri:save-line" />
                  </button>
                </template>
                <template v-else>
                  <button class="p-1">
                    <SvgIcon icon="ri:edit-line" @click="handleEdit(item, true, $event)" />
                  </button>
                  <NPopconfirm placement="bottom" @positive-click="handleDeleteDebounce(index, item.uuid, $event)">
                    <template #trigger>
                      <button class="p-1">
                        <SvgIcon icon="ri:delete-bin-line" />
                      </button>
                    </template>
                    {{ $t('chat.deleteHistoryConfirm') }}
                  </NPopconfirm>
                </template>
              </div>
            </a>
          </div>
        </template>
      </div>
    </a-spin>
  </NScrollbar>
</template>
