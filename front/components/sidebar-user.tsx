"use client";

import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { authContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

export default function SidebarUser({userData} : {userData: User}) {
  const { isMobile } = useSidebar()
  const { setUser } = React.useContext(authContext);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const theme =
  typeof window !== "undefined" &&
  document.documentElement.classList.contains("dark")
    ? "dark"
    : "light"

  const currentUserColor = userData.color || "#000000"

  const effectiveColor =
  (currentUserColor.toLowerCase() === "#ffffff" && theme === "light")
    ? "#000000"
    : (currentUserColor.toLowerCase() === "#000000" && theme === "dark")
      ? "#ffffff"
      : currentUserColor

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
              <div className="w-[32px] h-[32px] rounded-md" style={{ backgroundColor: effectiveColor }}></div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userData.username}</span>
                <span className="truncate text-xs">{userData.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}