"use client";

import { ModeToggle } from '@/components/modeToggle';
import { AppSidebar } from '@/components/sidebar-app';
import ChatTitle from '@/components/sidebar-chat-title';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/authContext';

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
          <SidebarInset>
          <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-md bg-white/80 dark:bg-black/80 border-b px-4">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator orientation="vertical" />
            <div className="w-full flex items-center justify-between pl-2">
              <ChatTitle />
              <ModeToggle />
            </div>
          </header>
          <div className="h-full">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
