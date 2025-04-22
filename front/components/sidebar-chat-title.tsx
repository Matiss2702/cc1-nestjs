"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Chat } from "@/types/chat"
import { useUser } from "@/hooks/use-user"

export default function ChatTitle() {
  const params = useParams()
  const chatId = params?.id as string
  const [chat, setChat] = useState<Chat | null>(null)
  const currentUser = useUser()

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/chats/${chatId}`)
        setChat(res.data)
      } catch (err) {
        console.error("Erreur chargement du chat dans ChatTitle", err)
      }
    }

    if (chatId) fetchChat()
  }, [chatId])

  if (!chat || !currentUser) return null

  const isGroup = chat.is_group
  const otherUser = !isGroup
    ? chat.members.find((m) => m.user.id !== currentUser.sub)?.user
    : null

  const title = isGroup
    ? `Talk to ${chat.name}`
    : `Talk with ${otherUser?.username ?? "..."}`

  return <h1 className="text-xl font-bold truncate">{title}</h1>
}
