"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api";
import { authContext } from "@/context/authContext";
import { useContext } from "react";
import { User } from "@/types/user";

const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Mot de passe requis" }),
});

interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  color?: string;
  exp: number;
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useContext(authContext);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await api.post("/auth/login", data);
      const token = res.data.access_token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode<JwtPayload>(token);
            
      const user: User = {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.username,
        color: decoded.color ?? "#FFFFFF",
        sub: decoded.sub,
      };
      setUser(user);

      toast("Connexion réussie ✅", {
        description: "Vous êtes maintenant connecté.",
      });

      router.push("/chat");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Erreur login:", err);

      toast("Erreur de connexion ❌", {
        description:
          err.response?.data?.message ||
          "Une erreur inconnue s'est produite.",
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Button variant="link" asChild>
              <Link href="/register">Créer un compte</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
