"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AxiosError } from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { authContext } from "@/context/authContext"
import api from "@/lib/api"
import React from "react"

const formSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  username: z.string().min(3, { message: "Minimum 3 caractères" }),
  color: z.string().optional(),
})

export default function ProfilePage() {
  const { user, setUser } = React.useContext(authContext)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      color: "#ffffff",
    },
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    form.reset({
      email: user.email || "",
      username: user.username || "",
      color: user.color || "#ffffff",
    })
  }, [user, router, form])

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) return

    try {
      const response = await api.put(`/users/${user.id}`, data)
      setUser({ ...user, ...response.data })

      toast("Profil mis à jour 🎉", {
        description: "Vos informations ont été enregistrées.",
      })
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>
      console.error("Erreur update profil:", err)

      toast("Erreur lors de la mise à jour ❌", {
        description: err.response?.data?.message || "Une erreur inconnue s'est produite.",
      })
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Mon Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d&apos;utilisateur</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur de profil</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Mettre à jour
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  )
}
