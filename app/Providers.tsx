"use client"

import { SessionProvider } from "next-auth/react" // ہم نے یہاں /react کا اضافہ کر دیا ہے
import { useEffect } from "react"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  
  useEffect(() => {
    // Background mein PWA App ko active karne ke liye service worker register kar rahe hain
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Pharmacy PWA Active!', reg.scope))
        .catch((err) => console.log('PWA Registration Failed!', err));
    }
  }, [])

  return <SessionProvider>{children}</SessionProvider>
}