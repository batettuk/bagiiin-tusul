import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Nara - Mongolian AI Assistant',
  description: 'AI Voice Assistant for navigation and information in Mongolian.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
