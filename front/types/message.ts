export type Message = {
  id: string
  content: string
  chatId: string
  senderId: string
  createdAt: string
  sender: {
    id: string
    username: string
    color: string
  }
}
