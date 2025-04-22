import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import Link from "next/link"
import { format, isToday, isYesterday } from "date-fns"
import { fr } from "date-fns/locale/fr"
import { Chat } from "@/types/chat"
import { User } from "@/types/user"
import { useParams } from "next/navigation"

export default function SidebarListChats({
  chats,
  currentUser,
}: {
  chats: Chat[]
  currentUser: User
}) {
  const params = useParams()
  const chatId = params?.id as string

  if (!Array.isArray(chats)) {
    return (
      <SidebarGroup className="px-0">
        <SidebarGroupContent className="p-4 text-sm text-muted-foreground">
          Chat unavailable
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent className="overflow-x-hidden">
        {chats.map((chat) => {
          const lastMessage = chat.messages.at(-1)
          const is1v1 = !chat.is_group
          const otherUser = is1v1
            ? chat.members.find((member) => member.user.id !== currentUser.sub)?.user
            : undefined

          const displayTitle = chat.is_group
            ? chat.name
            : otherUser?.username ?? "Unknown"


          const messageDate = new Date(lastMessage?.createdAt ?? chat.createdAt)

          const displayDate = isToday(messageDate)
            ? "Today"
            : isYesterday(messageDate)
            ? "Yesterday"
            : format(messageDate, "dd/MM/yyyy", { locale: fr })

          const isFromCurrentUser = lastMessage?.sender?.id === currentUser.sub

          const displayMessage = lastMessage
            ? isFromCurrentUser
              ? `You : ${lastMessage.content}`
              : `${lastMessage.sender?.username ?? "Unknown"} : ${lastMessage.content}`
            : chat.is_group
              ? `Talk to "${chat.name}" !`
              : `Talk with ${otherUser?.username} !`
          
              const isGroup = chat.is_group
              
              const otherMember = !isGroup
                ? chat.members.find((member) => member.user.id !== currentUser.sub)
                : null
              
              const otherColor = otherMember?.user.color || "#000000"
              
              const theme =
                typeof window !== "undefined" &&
                document.documentElement.classList.contains("dark")
                  ? "dark"
                  : "light"
              
              const effectiveColor =
                (otherColor.toLowerCase() === "#ffffff" && theme === "light")
                  ? "#000000"
                  : (otherColor.toLowerCase() === "#000000" && theme === "dark")
                    ? "#ffffff"
                    : otherColor
              
          return (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className={`flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground focus-visible:outline-none ${
                chat.id === chatId ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
              }`}
            >
              <div className="flex items-top justify-between w-full gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md h-[32px] w-[32px]" style={{ backgroundColor: effectiveColor }}></span>
                  <div className="flex flex-col">
                    <span className="font-bold">{displayTitle}</span>
                    <span className="line-clamp-1 max-w-[120px] whitespace-break-spaces text-xs">
                      {displayMessage}
                    </span>
                  </div>
                </div>
                <span className="text-xs">{displayDate}</span>
              </div>
            </Link>
          )
        })}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
