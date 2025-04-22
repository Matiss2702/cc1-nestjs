import { Message } from "@/types/message"
import { ChatMember } from "@/types/chat-member"

export type Chat = {
  id: string
  is_group: boolean
  name: string
  createdAt: string
  updatedAt: string
  members: ChatMember[]
  messages: Message[]
}
