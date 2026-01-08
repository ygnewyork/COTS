import { UserProvider } from '@/context/UserContext';
import './globals.css';

export const metadata = {
  title: 'ClarityCapital - Master Your Credit Score',
  description: 'Stop guessing. Start knowing. The credit sandbox that teaches you the game.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-clarity-dark min-h-screen antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
