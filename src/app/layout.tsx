'use client';
import 'jsvectormap/dist/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import '@/css/satoshi.css';
import '@/css/style.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import AuthProvider from '@/components/Common/AuthProvider';
import Script from 'next/script';
import { config } from '@fortawesome/fontawesome-svg-core';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  config.autoAddCss = false;

  return (
    <AuthProvider>
      <html lang='en'>
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
