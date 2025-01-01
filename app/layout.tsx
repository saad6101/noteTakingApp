import { Metadata } from 'next'
import ThemeToggler from './components/ThemeToggler'
import './globals.css'

export const metadata: Metadata = {
  title: 'Note Taking App',
  description: 'A simple note taking application',
}

export default function RootLayout({ 
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="">
<ThemeToggler/>
{children}
      </body>
    </html>
  )
}