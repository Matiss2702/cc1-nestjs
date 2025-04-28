'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authContext } from "@/context/authContext"
import api from "@/lib/api"
import React from "react"

export default function ProfilePage() {
  const { user, setUser } = React.useContext(authContext)
  const router = useRouter()

  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [color, setColor] = useState(user?.color || "#ffffff")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updatedProfile = { username, email, color }

    try {

      const response = await api.put(`/users/${user?.id}`, updatedProfile)

      setUser({ ...user, ...response.data })

      toast.success("Profil mis à jour !")
    } catch (error) {

      console.error(error)
      toast.error("Erreur lors de la mise à jour du profil.")
    }
  }

  return (
    <div className="profile-page p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Mon Profil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nom d'utilisateur
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Couleur personnalisée
          </label>
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full mt-4">
          Mettre à jour
        </Button>
      </form>
    </div>
  )
}
