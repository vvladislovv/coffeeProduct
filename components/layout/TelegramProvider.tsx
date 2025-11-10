'use client';

import { useEffect } from 'react';
import { initStorage } from '@/lib/initStorage';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        themeParams?: {
          bg_color?: string;
          text_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
      };
    };
  }
}

export default function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Инициализация localStorage
      initStorage();

      // Удаление атрибута bis_skin_checked, который добавляет Telegram
      const removeBisSkinChecked = () => {
        try {
          const elements = document.querySelectorAll('[bis_skin_checked]');
          elements.forEach(el => {
            try {
              el.removeAttribute('bis_skin_checked');
            } catch (e) {
              // Игнорируем ошибки при удалении атрибута
            }
          });
        } catch (e) {
          // Игнорируем ошибки
        }
      };

      // Удаляем сразу и после небольшой задержки
      removeBisSkinChecked();
      const interval1 = setTimeout(removeBisSkinChecked, 100);
      const interval2 = setTimeout(removeBisSkinChecked, 500);
      const interval3 = setTimeout(removeBisSkinChecked, 1000);

      // Наблюдатель за изменениями DOM
      const observer = new MutationObserver((mutations) => {
        let shouldRemove = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
            shouldRemove = true;
          }
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && (node as Element).hasAttribute('bis_skin_checked')) {
                shouldRemove = true;
              }
            });
          }
        });
        if (shouldRemove) {
          removeBisSkinChecked();
        }
      });
      
      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['bis_skin_checked'],
        childList: true
      });

      try {
        // Инициализация Telegram WebApp
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();
          
          // Настройка цветовой схемы
          const theme = window.Telegram.WebApp.themeParams;
          if (theme) {
            if (theme.bg_color) {
              document.documentElement.style.setProperty('--tg-theme-bg-color', theme.bg_color);
            }
            if (theme.text_color) {
              document.documentElement.style.setProperty('--tg-theme-text-color', theme.text_color);
            }
            if (theme.button_color) {
              document.documentElement.style.setProperty('--tg-theme-button-color', theme.button_color);
            }
            if (theme.button_text_color) {
              document.documentElement.style.setProperty('--tg-theme-button-text-color', theme.button_text_color);
            }
          }
        }
      } catch (error) {
        console.log('Telegram WebApp not available, running in browser mode');
      }

      return () => {
        clearTimeout(interval1);
        clearTimeout(interval2);
        clearTimeout(interval3);
        observer.disconnect();
      };
    }
  }, []);

  return <div suppressHydrationWarning>{children}</div>;
}

