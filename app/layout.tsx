import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Daily Habits',
  description: 'Track your morning and evening routines',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Daily Habits</h1>
            <nav className="flex gap-5 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Today
              </Link>
              <Link href="/insights" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Insights
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
