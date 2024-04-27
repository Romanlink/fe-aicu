import { useChatStore } from '@/store'

export function useChat() {
  const chatStore = useChatStore()

  const getChatByUuidAndIndex = (uuid: number, index: number) => {
    return chatStore.getChatByUuidAndIndex(uuid, index)
  }

  const addChat = (uuid: number, chat: Chat.Chat) => {
    chatStore.addChatByUuid(uuid, chat)
  }

  const updateChat = (uuid: number, index: number, chat: Chat.Chat) => {
    chatStore.updateChatByUuid(uuid, index, chat)
  }

  const updateChatSome = (uuid: number, index: number, chat: Partial<Chat.Chat>) => {
    chatStore.updateChatSomeByUuid(uuid, index, chat)
  }

  const updateChatSomeByChatId = (uuid: number, chatId: number, chat: Partial<Chat.Chat>) => {
    if(!chatId) return
    chatStore.updateChatSomeByChatId(uuid, chatId, chat)
  }

  return {
    addChat,
    updateChat,
    updateChatSome,
    updateChatSomeByChatId,
    getChatByUuidAndIndex,
  }
}
