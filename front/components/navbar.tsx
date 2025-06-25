"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authContext } from "@/context/authContext";
import { ModeToggle } from "@/components/modeToggle";
import { MessageSquare } from "lucide-react";

export default function Navbar() {
  const { user, setUser } = React.useContext(authContext);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith('/chat')) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="w-full top-0 fixed backdrop-blur-md bg-white/80 dark:bg-black/80 border-b z-50">
      <div className="w-full mx-auto max-w-7xl flex items-center justify-between py-2 px-4">
        <ul>
          <li>
            <Button asChild variant="ghost">
              <Link href="/">Home</Link>
            </Button>
          </li>
        </ul>

        <ul className="flex items-center space-x-4">
          {!user ? (
            <>
              <li>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
              </li>
              <li>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </li>
            </>
          ) : (
            <>
              <li className="text-sm">
                <Button asChild>
                  <Link href="/chat">
                    <MessageSquare />
                    <span>Chat with people!</span>                  
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </>
          )}
          <li>
            <ModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
