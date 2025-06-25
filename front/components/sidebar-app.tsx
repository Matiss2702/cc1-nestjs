import { useEffect, useState } from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SearchForm } from "@/components/sidebar-search-form"
import SidebarUser from "@/components/sidebar-user"
import SidebarListChats from "@/components/sidebar-list-chats"
import { useUser } from "@/hooks/use-user"
import api from "@/lib/api"
import { socket } from "@/lib/socket"
import { Message } from "@/types/message"
import { Chat } from "@/types/chat"

export function AppSidebar() {
  const user = useUser()
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    if (!user) return

    const fetchChats = async () => {
      try {
        const res = await api.get("/chats")
        setChats(res.data)
      } catch (err) {
        console.error("Erreur lors du chargement des chats :", err)
      }
    }

    fetchChats()
  }, [user])

  useEffect(() => {
    const handleIncomingMessage = (message: Message) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                messages: [message],
              }
            : chat
        )
      )
    }

    socket.on("message", handleIncomingMessage)

    return () => {
      socket.off("message", handleIncomingMessage)
    }
  }, [])

  if (!user) return null

  return (
    <Sidebar>
      <SidebarHeader>
        <SearchForm className="py-2" />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarListChats chats={chats} currentUser={user} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarUser userData={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
