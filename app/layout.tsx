import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Josefin_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
  display:  'swap',
})

const josefin = Josefin_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display:  'swap',
})

export const metadata: Metadata = {
  title: {
    default:  'Kanisa360',
    template: '%s | Kanisa360',
  },
  description: 'Mfumo wa Usimamizi wa Kanisa — Church Management System',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f0e17',
  width:      'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw" className={`${cormorant.variable} ${josefin.variable} dark`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
