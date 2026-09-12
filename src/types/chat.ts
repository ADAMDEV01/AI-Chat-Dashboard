export type Role = 'user' | 'assistant'
export type MessageStatus = 'sending' | 'complete' | 'error'
export type Theme = 'light' | 'dark' | 'system'

export interface Message {
  id: string
  role: Role
  content: string
  createdAt: number
  status: MessageStatus
}

export interface Conversation {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: Message[]
}
