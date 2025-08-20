import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/main-layout';
import { ProfileProvider } from '@/hooks/use-profile';

export const metadata: Metadata = {
  title: 'ShadowNet Intel',
  description: 'Real-time threat analysis dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
        <ProfileProvider>
          <MainLayout>{children}</MainLayout>
        </ProfileProvider>
        <Toaster />
      </body>
    </html>
  );
}
