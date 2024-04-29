<script setup lang='ts'>
import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NAutoComplete, NButton, NInput, useDialog, useMessage } from 'naive-ui'
import html2canvas from 'html2canvas'
import { Message } from './components'
import { useScroll } from './hooks/useScroll'
import { useChat } from './hooks/useChat'
import { useUsingContext } from './hooks/useUsingContext'
import HeaderComponent from './components/Header/index.vue'
import { HoverButton, SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useChatStore, usePromptStore } from '@/store'
import { fetchChatAPIProcess } from '@/api'
import { t } from '@/locales'
import { json } from 'stream/consumers'
import { chatGus, getCurChatIdApi, getChatDetailApi, chatEditApi } from '@/api/chat'
import moment from 'moment'

let controller = new AbortController()

let chatIdRecord = ref('')

const openLongReply = import.meta.env.VITE_GLOB_OPEN_LONG_REPLY === 'true'

const route = useRoute()
const dialog = useDialog()
const ms = useMessage()

const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex, updateChatSomeByChatId } = useChat()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
const { usingContext, toggleUsingContext } = useUsingContext()

let { uuid } = route.params as { uuid: string }

// const dataSources = computed(() => chatStore.getChatByUuid(+uuid))
const pageLoading = ref<boolean>(false)
const dataSources = ref<any[]>([])
const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion && !!item.conversationOptions)))

const prompt = ref<string>('')
const loading = ref<boolean>(false)
const inputRef = ref<Ref | null>(null)

interface IQuestion {
  question: string
  sort: number
}
const questions = ref<IQuestion[]>([])

// 添加PromptStore
const promptStore = usePromptStore()

// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
const { promptList: promptTemplate } = storeToRefs<any>(promptStore)

// 未知原因刷新页面，loading 状态不会重置，手动重置
dataSources.value.forEach((item, index) => {
  if (item.loading)
    updateChatSome(+uuid, index, { loading: false })
})

function handleSubmit() {
  onConversation()
}

function handleSubmitWithPrompt(question: string) {
  onConversation(question)
}

/**
 * 查询当前对话ID
 */
const getCurChatId = async () => {
  const id = await getCurChatIdApi({})

  return new Promise(resolve => {
    resolve(id || '')
  })
}

/**
 * 查询对话列表
 */
const getChatList = async (uuid: any) => {
  pageLoading.value = true
  const chats: any = await getChatDetailApi({ chatId: uuid })

  const { contentDtoList } = chats

  contentDtoList.reverse()

  dataSources.value = contentDtoList.map((item: any, index: number) => {
    return {
      dateTime: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
      text: item.content,
      inversion: item.type == 1 ? true : false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: item.type == 1 ? item.content : contentDtoList[index - 1].content, options: null },
    }
  })

  scrollToBottom()
  pageLoading.value = false

  if (!contentDtoList.length) {
    getQuestions()
  }

  // return new Promise(resolve => {
  //   resolve(chats || '')
  // })
}

/**
 * 获取猜你想问
 * @param question 
 */
const getQuestions = async (chatId?: string | number, index?: number) => {
  const data: any = await chatGus({
    chatId
  })
  questions.value = data || []
  if (index != undefined) {
    dataSources.value[index].gusQuestions = data || []
  }
  return new Promise(resolve => {
    resolve(data || [])
  })
}

async function onConversation(question?: string) {

  let message = question || prompt.value

  if (uuid && chatStore.active && dataSources.value.length == 0) {
    chatEditApi({ chatId: uuid, title: message })
    chatStore.setNewMenu(uuid + '_' + message)
  }

  if (loading.value)
    return

  if (!message || message.trim() === '')
    return

  controller = new AbortController()

  // addChat(
  //   +uuid,
  //   {
  //     dateTime: new Date().toLocaleString(),
  //     text: message,
  //     inversion: true,
  //     error: false,
  //     conversationOptions: null,
  //     requestOptions: { prompt: message, options: null },
  //   },
  // )

  dataSources.value.splice(dataSources.value.length, 0, {
    dateTime: new Date().toLocaleString(),
    text: message,
    inversion: true,
    error: false,
    conversationOptions: null,
    requestOptions: { prompt: message, options: null },
  })

  scrollToBottom()

  if (!chatStore.active && !uuid && !chatIdRecord.value) {
    localStorage.newChat = message
    chatStore.setNewChat(new Date())
  }

  loading.value = true
  prompt.value = ''

  let options: Chat.ConversationRequest = {}
  const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions

  if (lastContext && usingContext.value)
    options = { ...lastContext }

  // addChat(
  //   +uuid,
  //   {
  //     dateTime: new Date().toLocaleString(),
  //     text: t('chat.thinking'),
  //     loading: true,
  //     inversion: false,
  //     error: false,
  //     conversationOptions: null,
  //     requestOptions: { prompt: message, options: { ...options } },
  //   },
  // )
  dataSources.value.splice(dataSources.value.length, 0, {
    dateTime: new Date().toLocaleString(),
    text: t('chat.thinking'),
    loading: true,
    inversion: false,
    error: false,
    conversationOptions: null,
    requestOptions: { prompt: message, options: { ...options } },
  })
  scrollToBottom()

  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>({
        chatId: uuid || chatIdRecord.value,
        prompt: message,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target

          const { responseText } = xhr

          let responseArr = responseText.split('\n')
          responseArr = responseArr.filter((item: any) => { return item })

          let resText = ''
          responseArr.forEach((item: any) => {
            const substrText = item && item.length > 5 ? item.substring(5) : ''
            if (substrText) {
              const itemData = JSON.parse(substrText)
              resText += itemData.content || ''
            }
          })

          // Always process the final line
          const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
          let chunk = responseText
          if (lastIndex !== -1)
            chunk = responseText.substring(lastIndex)
          try {
            // const data = JSON.parse(chunk)
            const data = responseArr[responseArr.length - 1]

            // updateChat(
            //   +uuid,
            //   dataSources.value.length - 1,
            //   {
            //     dateTime: new Date().toLocaleString(),
            //     // text: lastText + (data.text ?? ''),
            //     text: resText,
            //     inversion: false,
            //     error: false,
            //     loading: true,
            //     conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
            //     requestOptions: { prompt: message, options: { ...options } },
            //   },
            // )
            dataSources.value[dataSources.value.length - 1] = {
              dateTime: new Date().toLocaleString(),
              text: resText,
              loading: true,
              inversion: false,
              error: false,
              conversationOptions: null,
              requestOptions: { prompt: message, options: { ...options } },
            }

            if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
              options.parentMessageId = data.id
              lastText = data.text
              message = ''
              return fetchChatAPIOnce()
            }

            scrollToBottomIfAtBottom()
          }
          catch (error) {
            //
          }
        },
      })
      // updateChatSome(+uuid, dataSources.value.length - 1, { loading: false })
      // dataSources.value[dataSources.value.length - 1] = {
      //   ...dataSources.value[dataSources.value.length - 1], ...{ loading: false }
      // }
      dataSources.value[dataSources.value.length - 1].loading = false
    }

    await fetchChatAPIOnce()
    let chatId: any = ''

    if (!chatStore.active && !uuid && !chatIdRecord.value) {
      chatId = await getCurChatId()
      chatIdRecord.value = chatId
      chatStore.setNewChatId(chatId)
    }

    // loading.value = false

    // updateChatSome(+uuid, dataSources.value.length - 1, { chatId: uuid || '' })
    getQuestions(uuid || chatIdRecord.value, dataSources.value.length - 1)
    // updateChatSomeByChatId(+uuid, uuid, { gusQuestions: gusQuestions || [] })
    // dataSources.value[dataSources.value.length - 1] = {
    //   ...dataSources.value[dataSources.value.length - 1], ...{ gusQuestions: gusQuestions || [] }
    // }
    // dataSources.value[dataSources.value.length - 1].gusQuestions = gusQuestions || []
    // scrollToBottomIfAtBottom()
  }
  catch (error: any) {
    const errorMessage = error?.message ?? t('common.wrong')

    if (error.message === 'canceled') {
      // updateChatSome(
      //   +uuid,
      //   dataSources.value.length - 1,
      //   {
      //     loading: false,
      //   },
      // )
      dataSources.value[dataSources.value.length - 1] = {
        ...dataSources.value[dataSources.value.length - 1], ...{ loading: false }
      }
      scrollToBottomIfAtBottom()
      return
    }

    // const currentChat = getChatByUuidAndIndex(+uuid, dataSources.value.length - 1)

    // if (currentChat?.text && currentChat.text !== '') {
    //   updateChatSome(
    //     +uuid,
    //     dataSources.value.length - 1,
    //     {
    //       text: `${currentChat.text}\n[${errorMessage}]`,
    //       error: false,
    //       loading: false,
    //     },
    //   )
    //   return
    // }

    // updateChat(
    //   +uuid,
    //   dataSources.value.length - 1,
    //   {
    //     dateTime: new Date().toLocaleString(),
    //     text: errorMessage,
    //     inversion: false,
    //     error: true,
    //     loading: false,
    //     conversationOptions: null,
    //     requestOptions: { prompt: message, options: { ...options } },
    //   },
    // )
    // scrollToBottomIfAtBottom()
  }
  finally {
    loading.value = false
  }
}

async function onRegenerate(index: number) {
  if (loading.value)
    return

  controller = new AbortController()

  const { requestOptions } = dataSources.value[index]

  let message = requestOptions?.prompt ?? ''

  let options: Chat.ConversationRequest = {}

  if (requestOptions.options)
    options = { ...requestOptions.options }

  loading.value = true

  // updateChat(
  //   +uuid,
  //   index,
  //   {
  //     dateTime: new Date().toLocaleString(),
  //     text: '',
  //     inversion: false,
  //     error: false,
  //     loading: true,
  //     conversationOptions: null,
  //     requestOptions: { prompt: message, options: { ...options } },
  //   },
  // )
  dataSources.value[index] = {
    dateTime: new Date().toLocaleString(),
    text:  t('chat.thinking'),
    inversion: false,
    error: false,
    loading: true,
    conversationOptions: null,
    requestOptions: { prompt: message, options: null },
  }

  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>({
        chatId: uuid,
        prompt: message,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr

          let responseArr = responseText.split('\n')
          responseArr = responseArr.filter((item: any) => { return item })

          let resText = ''
          responseArr.forEach((item: any) => {
            const substrText = item && item.length > 5 ? item.substring(5) : ''
            if (substrText) {
              const itemData = JSON.parse(substrText)
              resText += itemData.content || ''
            }
          })

          // Always process the final line
          const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
          let chunk = responseText
          if (lastIndex !== -1)
            chunk = responseText.substring(lastIndex)
          try {
            // const data = JSON.parse(chunk)
            const data = responseArr[responseArr.length - 1]
            // updateChat(
            //   +uuid,
            //   index,
            //   {
            //     dateTime: new Date().toLocaleString(),
            //     // text: lastText + (data.text ?? ''),
            //     text: resText,
            //     inversion: false,
            //     error: false,
            //     loading: true,
            //     conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
            //     requestOptions: { prompt: message, options: { ...options } },
            //   },
            // )

            dataSources.value[index] = {
              dateTime: new Date().toLocaleString(),
              text: resText,
              inversion: false,
              error: false,
              loading: true,
              conversationOptions: null,
              requestOptions: { prompt: message, options: null },
            }

            if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
              options.parentMessageId = data.id
              lastText = data.text
              message = ''
              return fetchChatAPIOnce()
            }
          }
          catch (error) {
            //
          }
        },
      })
      // updateChatSome(+uuid, index, { loading: false })
      dataSources.value[index] = {
        ...dataSources.value[index], ...{ loading: false }
      }
    }
    await fetchChatAPIOnce()

    // updateChatSome(+uuid, dataSources.value.length - 1, { chatId: requestOptions.chatId || '' })
    // const gusQuestions = await getQuestions(requestOptions.chatId)
    // updateChatSomeByChatId(+uuid, requestOptions.chatId, { gusQuestions: gusQuestions || [] })
    // scrollToBottomIfAtBottom()
  }
  catch (error: any) {
    if (error.message === 'canceled') {
      // updateChatSome(
      //   +uuid,
      //   index,
      //   {
      //     loading: false,
      //   },
      // )
      dataSources.value[index] = {
        ...dataSources.value[index], ...{ loading: false }
      }
      return
    }

    // const errorMessage = error?.message ?? t('common.wrong')

    // updateChat(
    //   +uuid,
    //   index,
    //   {
    //     dateTime: new Date().toLocaleString(),
    //     text: errorMessage,
    //     inversion: false,
    //     error: true,
    //     loading: false,
    //     conversationOptions: null,
    //     requestOptions: { prompt: message, options: { ...options } },
    //   },
    // )
  }
  finally {
    loading.value = false
  }
}

function handleExport() {
  if (loading.value)
    return

  const d = dialog.warning({
    title: t('chat.exportImage'),
    content: t('chat.exportImageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        d.loading = true
        const ele = document.getElementById('image-wrapper')
        const canvas = await html2canvas(ele as HTMLDivElement, {
          useCORS: true,
        })
        const imgUrl = canvas.toDataURL('image/png')
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = imgUrl
        tempLink.setAttribute('download', 'chat-shot.png')
        if (typeof tempLink.download === 'undefined')
          tempLink.setAttribute('target', '_blank')

        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(imgUrl)
        d.loading = false
        ms.success(t('chat.exportSuccess'))
        Promise.resolve()
      }
      catch (error: any) {
        ms.error(t('chat.exportFailed'))
      }
      finally {
        d.loading = false
      }
    },
  })
}

function handleDelete(index: number) {
  if (loading.value)
    return

  dialog.warning({
    title: t('chat.deleteMessage'),
    content: t('chat.deleteMessageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.deleteChatByUuid(+uuid, index)
    },
  })
}

function handleClear() {
  if (loading.value)
    return

  dialog.warning({
    title: t('chat.clearChat'),
    content: t('chat.clearChatConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.clearChatByUuid(+uuid)
    },
  })
}

function handleEnter(event: KeyboardEvent) {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
  else {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
}

function handleStop() {
  if (loading.value) {
    controller.abort()
    loading.value = false
  }
}

// 可优化部分
// 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
// 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
const searchOptions = computed(() => {
  if (prompt.value.startsWith('/')) {
    return promptTemplate.value.filter((item: { key: string }) => item.key.toLowerCase().includes(prompt.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
      return {
        label: obj.value,
        value: obj.value,
      }
    })
  }
  else {
    return []
  }
})

// value反渲染key
const renderOption = (option: { label: string }) => {
  for (const i of promptTemplate.value) {
    if (i.value === option.label)
      return [i.key]
  }
  return []
}

const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder')
})

const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === ''
})

const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
  return classes
})

onMounted(async () => {
  scrollToBottom()
  if (chatStore.active && uuid) {
    getChatList(uuid)
  } else {
    getQuestions()
  }
  if (inputRef.value && !isMobile.value)
    inputRef.value?.focus()
})

watch(() => chatStore.delAll, (oldValue, newValue) => {
  dataSources.value = []
})

onUnmounted(() => {
  if (loading.value)
    controller.abort()
})
</script>

<template>
  <a-spin :loading="pageLoading" style="width:100%;height:calc(100vh - 100px)">
    <div class="relative flex flex-col w-full h-full xxxxx" style="height:calc(100vh - 100px)">
      <HeaderComponent v-if="isMobile" :using-context="usingContext" @export="handleExport"
        @handle-clear="handleClear" />
      <main class="flex-1 overflow-hidden">
        <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
          <div id="image-wrapper" class="w-full max-w-screen-xl m-auto dark:bg-[#101014]"
            :class="[isMobile ? 'p-2' : 'p-4']">
            <template v-if="!dataSources.length">
              <div class="flex items-center flex-col justify-center mt-20 text-center text-neutral-400">
                <!-- <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />
              <span>{{ t('chat.newChatTitle') }}11111</span> -->
                <div class="text-lg text-neutral-600">数据熊</div>
                <div class="mt-2">我可以自动通过全网数据分析了解市场动态</div>
                <div class="mt-1">为您的公司业务提高投资回报率</div>
                <div class="mt-2 cursor-pointer underline text-[#18a058]" @click="handleSubmitWithPrompt('你能做什么?')">
                  了解我能做什么？</div>
              </div>
            </template>
            <template v-else>
              <div>
                <Message v-for="(item, index) of dataSources" :key="index" :date-time="item.dateTime" :text="item.text"
                  :inversion="item.inversion" :error="item.error" :loading="item.loading"
                  :gusQuestions="item.gusQuestions" @regenerate="onRegenerate(index)" @delete="handleDelete(index)"
                  @onConversation="handleSubmitWithPrompt" />
                <div class="sticky bottom-0 left-0 flex justify-center">
                  <NButton v-if="loading" type="warning" @click="handleStop">
                    <template #icon>
                      <SvgIcon icon="ri:stop-circle-line" />
                    </template>
                    {{ t('common.stopResponding') }}
                  </NButton>
                </div>
              </div>
            </template>
          </div>
        </div>
      </main>
      <footer :class="footerClass">
        <div class="w-full max-w-screen-xl mb-2 m-auto flex justify-center flex-wrap"
          v-if="questions && questions.length > 0 && !dataSources.length">
          <div>你可能想问:</div>
          <a-tag v-for="(item, index) of questions" class="ml-3 cursor-pointer" :key="index" color="#36ad6a"
            @click="handleSubmitWithPrompt(item.question)">{{ item.question }}</a-tag>
        </div>
        <div class="w-full max-w-screen-xl m-auto">
          <div class="flex items-center justify-between space-x-2">
            <!-- <HoverButton v-if="!isMobile" @click="handleClear">
              <span class="text-xl text-[#4f555e] dark:text-white">
                <SvgIcon icon="ri:delete-bin-line" />
              </span>
            </HoverButton> -->
            <HoverButton v-if="!isMobile" @click="handleExport">
              <span class="text-xl text-[#4f555e] dark:text-white">
                <SvgIcon icon="ri:download-2-line" />
              </span>
            </HoverButton>
            <!-- <HoverButton @click="toggleUsingContext">
            <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingContext, 'text-[#a8071a]': !usingContext }">
              <SvgIcon icon="ri:chat-history-line" />
            </span>
          </HoverButton> -->
            <NAutoComplete v-model:value="prompt" :options="searchOptions" :render-label="renderOption">
              <template #default="{ handleInput, handleBlur, handleFocus }">
                <NInput ref="inputRef" v-model:value="prompt" type="textarea" :placeholder="placeholder"
                  :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }" @input="handleInput" @focus="handleFocus"
                  @blur="handleBlur" @keypress="handleEnter" />
              </template>
            </NAutoComplete>
            <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
              <template #icon>
                <span class="dark:text-black">
                  <SvgIcon icon="ri:send-plane-fill" />
                </span>
              </template>
            </NButton>
          </div>
        </div>
      </footer>

    </div>
  </a-spin>
</template>
