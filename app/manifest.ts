import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pharmacy SaaS VIP',
    short_name: 'PharmacySaaS',
    description: 'Advanced Pharmacy Management System',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a', // Slate-900 background color
    theme_color: '#2563eb',      // Blue-600 theme color
    icons: [
      {
        src: 'https://cdn-icons-png.flaticon.com/512/3022/3022831.png', // Demo icon for PWA
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://cdn-icons-png.flaticon.com/512/3022/3022831.png', // Demo icon for PWA
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}