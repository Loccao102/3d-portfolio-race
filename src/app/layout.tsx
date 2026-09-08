import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cao Tien Loc — Creative Technologist & WebGL Portfolio',
  description: 'Interactive 3D low-poly cyberpunk diorama portfolio built with Three.js, React Three Fiber, and Rapier Physics.',
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[#0c0f17] antialiased overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

