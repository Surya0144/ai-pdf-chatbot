import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Document Search',
  description: 'Upload PDFs and ask questions using AI-powered search',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
