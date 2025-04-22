"use client"

import { useParams } from "next/navigation"
import { JSX, useEffect, useRef, useState } from "react"
import { Chat } from "@/types/chat"
import { useUser } from "@/hooks/use-user"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { socket } from "@/lib/socket"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import ChatMessage from "@/components/sidebar-chat-message"
import { toast } from "sonner"
import { Message } from "@/types/message"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { format, isToday, isYesterday } from "date-fns"
import { fr } from "date-fns/locale/fr"

function formatChatDate(dateString: string): string {
  const date = new Date(dateString)
  if (isToday(date)) return "Aujourd'hui"
  if (isYesterday(date)) return "Hier"
  return format(date, "EEEE dd MMMM yyyy", { locale: fr })
}

export default function ChatPageDetail() {
  const params = useParams()
  const chatId = params?.id as string
  const [chat, setChat] = useState<Chat | null>(null)
  const currentUser = useUser()
  const bottomRef = useRef<HTMLDivElement>(null)

  const FormSchema = z.object({
    content: z.string().min(1, { message: "Message cannot be empty" }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  })

  const content = form.watch("content")
  const isValidMessage = content.trim().length > 0

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/chats/${chatId}`)
        setChat(res.data)
      } catch (err) {
        console.error("❌ Erreur lors du chargement du chat", err)
        toast.error("Impossible de charger la conversation")
      }
    }

    if (chatId) {
      fetchChat()
    }
  }, [chatId])

  useEffect(() => {
    if (chat?.messages.length) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 50)
    }
  }, [chat?.messages.length])

  useEffect(() => {
    const handleIncoming = (message: Message) => {
      if (message.chatId !== chatId) {
        toast("Message pour un autre chat ❌")
        return
      }

      setChat((prev) =>
        prev ? { ...prev, messages: [...prev.messages, message] } : prev
      )

      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    }

    socket.on("message", handleIncoming)
    return () => {
      socket.off("message", handleIncoming)
    }
  }, [chatId])  
  
  if (!chat || !currentUser) return <div>Loading...</div>

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!currentUser) return

    const cleaned = data.content.trim()
    if (cleaned.length === 0) return

    socket.emit("sendMessage", {
      chatId,
      senderId: currentUser.sub,
      content: cleaned,
    })

    form.reset({ content: "" })
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
  }

  return (
    <div className="w-full h-screen h-full flex flex-col justify-between">
      <div className="w-3/4 mx-auto px-4 pt-4">
        <div className="flex flex-col h-full gap-4 overflow-y-auto pr-2 ">
          {chat.messages.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center mt-4">
              Aucun message pour l’instant. Commence la conversation !
            </div>
          ) : (
            <>
              {(() => {
                const rendered: JSX.Element[] = []
                let lastDate = ""

                chat.messages.forEach((message, index) => {
                  const currentDate = new Date(message.createdAt).toDateString()
                  const showBadge = currentDate !== lastDate
                  lastDate = currentDate

                  if (showBadge) {
                    rendered.push(
                      <div key={`badge-${index}`} className="flex justify-center">
                        <Badge>{formatChatDate(message.createdAt)}</Badge>
                      </div>
                    )
                  }

                  rendered.push(
                    <ChatMessage
                      key={index}
                      message={message}
                      currentUser={currentUser}
                      isGroup={chat.is_group}
                    />
                  )
                })

                return (
                  <>
                    {rendered}
                    <div ref={bottomRef} className="h-0" />
                  </>
                )
              })()}
            </>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 w-full bg-background p-4">
        <footer className="w-3/4 mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2 rounded-md border border-input p-4 shadow dark:bg-input/30"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Écris ton message..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="icon"
                  className="cursor-pointer"
                  disabled={!isValidMessage}
                >
                  <span className="sr-only">Envoyer</span>
                  <Send />
                </Button>
              </div>
            </form>
          </Form>
        </footer>
      </div>
    </div>
  )
}
