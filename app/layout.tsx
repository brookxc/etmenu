import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: {
    template: "%s | ETMenu",
    default: "ETMenu - Discover Great Restaurants",
  },
  description: "Find and explore restaurants and their delicious menus",
  metadataBase: new URL("https://etmenu.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://etmenu.vercel.app",
    siteName: "ETMenu",
    title: "ETMenu - Discover Great Restaurants",
    description: "Find and explore restaurants and their delicious menus",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ETMenu - Discover Great Restaurants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ETMenu - Discover Great Restaurants",
    description: "Find and explore restaurants and their delicious menus",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

          {children}

      </body>
    </html>
  )
}
