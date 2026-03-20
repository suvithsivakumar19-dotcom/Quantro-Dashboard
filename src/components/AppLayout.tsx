import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProfileSettingsDialog } from '@/components/ProfileSettingsDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppLayout({ children }: { children: ReactNode }) {
  const { state } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        <div className="gradient-blob-1" />
        <div className="gradient-blob-2" />
        <div className="gradient-blob-3" />
        <AppSidebar />
        <div className="flex-1 flex flex-col relative z-10">
          <header className="h-16 flex items-center justify-between border-b border-border/40 px-6 backdrop-blur-xl bg-background/60">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-secondary rounded-lg" />
              <div className="hidden sm:block h-5 w-px bg-border/60" />
              <span className="hidden sm:block text-xs text-muted-foreground font-medium">Analytics Overview</span>
            </div>
            <div className="flex items-center gap-3">
              <DateRangeFilter />
              <NotificationsDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet flex items-center justify-center text-primary-foreground text-xs font-bold ring-offset-background transition-colors hover:ring-2 hover:ring-ring hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    {state.userProfile.name.charAt(0).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{state.userProfile.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{state.userProfile.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setProfileOpen(true)} className="cursor-pointer">
                    Profile Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ProfileSettingsDialog open={profileOpen} onOpenChange={setProfileOpen} />
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
