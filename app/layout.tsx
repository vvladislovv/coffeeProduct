import type { Metadata } from 'next';
import './globals.css';
import TelegramProvider from '@/components/layout/TelegramProvider';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Coffee House - Telegram Mini App',
  description: 'Заказывайте кофе и еду прямо в Telegram',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
        <style dangerouslySetInnerHTML={{__html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }
        `}} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <TelegramProvider>
          <div className="tg-viewport bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 min-h-screen">
            <Header />
            <main className="max-w-md mx-auto pb-20">
              {children}
            </main>
          </div>
        </TelegramProvider>
      </body>
    </html>
  );
}

