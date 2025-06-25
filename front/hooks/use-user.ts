import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

interface UserPayload {
  id: string
  email: string
  username: string
  color: string
  sub?: string
}

export function useUser() {
  const [user, setUser] = useState<UserPayload | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token)
        setUser(decoded)
      } catch (e) {
        console.error("Invalid token", e)
      }
    }
  }, [])

  return user
}
