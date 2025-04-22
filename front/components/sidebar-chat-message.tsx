"use client";

import { format } from "date-fns"
import { fr } from "date-fns/locale/fr"
import { Message } from "@/types/message"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { User } from "@/types/user";

export default function ChatMessage(
  { message, currentUser, isGroup = false }:
  { message: Message, currentUser: User, isGroup?: boolean }
) {
  const theme =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"

  const isCurrentUser = message.sender.id === currentUser.sub

  const senderColor = message.sender.color || "#000000"

  const effectiveColor =
  (senderColor.toLowerCase() === "#ffffff" && theme === "light")
    ? "#000000"
    : (senderColor.toLowerCase() === "#000000" && theme === "dark")
      ? "#ffffff"
      : senderColor

  return (
    <div className={`flex items-center ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <Card className="gap-2 p-4 w-content max-w-3/5 w-full">
        {!isCurrentUser && isGroup && (
          <CardHeader
            className="p-0 font-bold text-sm"
            style={{ color: effectiveColor }}
          >
            {message.sender.username}
          </CardHeader>
        )}
        <CardContent className="p-0">
          <div
            style={{
              color: effectiveColor,
              whiteSpace: "pre-wrap",
            }}
          >
            {message.content}
          </div>
        </CardContent>
        <CardFooter className="p-0 justify-end">
          <span className="block text-muted-foreground text-xs mb-1">
            {format(new Date(message.createdAt), "HH'h'mm", { locale: fr })}
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
