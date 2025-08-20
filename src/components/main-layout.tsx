'use client';

import * as React from 'react';
import Link from 'next/link';
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

const CustomLogo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#007BFF', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#00C6FF', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M50 10 C 52 15, 55 20, 90 25 L 90 60 C 90 80, 70 90, 50 95 C 30 90, 10 80, 10 60 L 10 25 C 45 20, 48 15, 50 10 Z"
      fill="url(#shieldGradient)"
      filter="url(#glow)"
    />
    <path
      d="M35 65 L 42 40 L 50 55 L 58 40 L 65 65"
      stroke="#FFFFFF"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = (pathname.split('/').pop() || 'dashboard').replace('-', ' ');

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: <LayoutDashboard />, exact: true },
    { href: '/alerts', label: 'Alerts', icon: <AlertTriangle /> },
    { href: '/reports', label: 'Reports', icon: <FileText /> },
    { href: '/analytics', label: 'Analytics', icon: <BarChart3 /> },
    { href: '/public-finder', label: 'Public Finder', icon: <Search /> },
    { href: '/chatbot', label: 'Chatbot', icon: <Bot /> },
    { href: '/awareness', label: 'Awareness', icon: <LifeBuoy /> },
    { href: '/case-management', label: 'Case Management', icon: <Briefcase /> },
    { href: '/settings', label: 'Settings', icon: <Settings /> },
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
              <CustomLogo />
              <h1 className="text-xl font-semibold text-primary">Mystic Squad</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton isActive={getIsActive(item.href, item.exact)}>
                        {item.icon}
                        {item.label}
                    </SidebarMenuButton>
                  </Link>
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
