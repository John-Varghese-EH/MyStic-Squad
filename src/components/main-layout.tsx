'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Shield,
  LayoutDashboard,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  Bot,
  LifeBuoy,
  Briefcase,
  Search,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = (pathname.split('/').pop() || 'dashboard').replace('-', ' ');

  const menuItems = [
    { href: '/', icon: <LayoutDashboard />, label: 'Dashboard', exact: true },
    { href: '/alerts', icon: <AlertTriangle />, label: 'Alerts' },
    { href: '/reports', icon: <FileText />, label: 'Reports' },
    { href: '/analytics', icon: <BarChart3 />, label: 'Analytics' },
    { href: '/public-finder', icon: <Search />, label: 'Public Finder' },
    { href: '/chatbot', icon: <Bot />, label: 'Chatbot' },
    { href: '/awareness', icon: <LifeBuoy />, label: 'Awareness' },
    { href: '/case-management', icon: <Briefcase />, label: 'Case Management' },
    { href: '/settings', icon: <Settings />, label: 'Settings' },
  ];

  const getIsActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href) && (href !== '/' || pathname === '/');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-semibold text-primary">ShadowNet</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton href={item.href} isActive={getIsActive(item.href, item.exact)}>
                    {item.icon}
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3">
               <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="Operator" data-ai-hint="profile picture" />
                  <AvatarFallback>OP</AvatarFallback>
                </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Operator</span>
                <span className="text-xs text-muted-foreground">Level 5 Analyst</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex items-center h-14 px-4 border-b bg-background/80 backdrop-blur-sm">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold capitalize">{pageTitle === '' ? 'dashboard' : pageTitle}</h2>
            </div>
          </header>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
