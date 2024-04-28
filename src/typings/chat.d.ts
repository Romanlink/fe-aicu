declare namespace Chat {

	interface Chat {
		dateTime: string
		text: string
		inversion?: boolean
		error?: boolean
		loading?: boolean
		conversationOptions?: ConversationRequest | null
		requestOptions: { prompt: string; options?: ConversationRequest | null }
		gusQuestions?: any,
		chatId?: any
	}

	interface History {
		title: string
		isEdit: boolean
		uuid: any
	}

	interface ChatState {
		newChat?: any,
		newChatId?: any,
		delAll?: any,
		newMenu?: any,
		active: any
		usingContext: boolean;
		history: History[]
		chat: { uuid: any | null; data: Chat[] }[]
	}

	interface ConversationRequest {
		conversationId?: string
		parentMessageId?: string
	}

	interface ConversationResponse {
		conversationId: string
		detail: {
			choices: { finish_reason: string; index: number; logprobs: any; text: string }[]
			created: number
			id: string
			model: string
			object: string
			usage: { completion_tokens: number; prompt_tokens: number; total_tokens: number }
		}
		id: string
		parentMessageId: string
		role: string
		text: string
		chatId: any
	}
}
