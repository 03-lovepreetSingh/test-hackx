import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './index.css'
import { SessionProvider } from './contexts/SessionContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hackathon Platform',
  description: 'A platform for hackathons and project submissions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}