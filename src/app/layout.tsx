import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cao Tiến Lộc — Backend Developer & 3D Web Portfolio',
  description:
    'Interactive 3D Vietnamese neo-urban portfolio built with Three.js, React Three Fiber, Rapier Physics, and Next.js.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className="bg-[#0c0f17] antialiased overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
