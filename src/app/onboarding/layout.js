import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function RootLayout({ children }) {
  const { sessionClaims } = await auth()
  
  // Check if onboarding is complete with safe property access
  const isOnboardingComplete = sessionClaims?.metadata?.onboardingComplete === true
  
  if (isOnboardingComplete) {
    redirect('/')
  }

  return <>{children}</>
}