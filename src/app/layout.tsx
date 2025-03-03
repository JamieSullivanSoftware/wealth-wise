'use client';
import 'jsvectormap/dist/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import '@/css/satoshi.css';
import '@/css/style.css';
import AuthProvider from '@/components/Common/AuthProvider';
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang='en'>
        <head>
          <link
            rel='stylesheet'
            href='https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.6.0/css/fontawesome.min.css'
            integrity='sha384-NvKbDTEnL+A8F/AA5Tc5kmMLSJHUO868P+lDtTpJIeQdGYaUIuLr4lVGOEA1OcMy'
            crossOrigin='anonymous'
          />
        </head>
        <body suppressHydrationWarning={true}>
          <Script
            src='/scripts/theme.js'
            strategy='beforeInteractive'
          />
          <div className='dark:bg-dark-4 dark:text-bodydark'>{children}</div>
        </body>
      </html>
    </AuthProvider>
  );
}
