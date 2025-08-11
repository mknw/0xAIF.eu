import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AuthButton from '@/components/AuthButton'
import Link from 'next/link'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '0xAIF.eu - Technical AI Founders Europe',
  description: 'The online hub for technical AI practitioners.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <nav className="sticky top-0 z-50 w-full flex justify-center border-b border-b-foreground/10 h-16 bg-black/50 backdrop-blur-lg">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
              <Link href="/events" className="hover:text-gray-300 transition-colors">Events</Link>
            </div>
            <AuthButton />
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

