import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bar Management System',
  description: 'Bar Management System',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  manifest: '/manifest.json',
  themeColor: '#312e81',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#312e81" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  console.log('Attempting to register service worker...');
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful:', registration);
                    })
                    .catch(function(err) {
                      console.log('ServiceWorker registration failed:', err);
                    });
                });
              } else {
                console.log('Service workers are not supported');
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

// ... existing code ...
