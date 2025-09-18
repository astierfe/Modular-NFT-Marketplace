import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'NFT Collection Viewer',
  description: 'View and interact with your NFT collection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}