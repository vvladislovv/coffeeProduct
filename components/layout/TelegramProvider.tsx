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
        const elements = document.querySelectorAll('[bis_skin_checked]');
        elements.forEach(el => el.removeAttribute('bis_skin_checked'));
      };

      // Удаляем сразу и после небольшой задержки
      removeBisSkinChecked();
      setTimeout(removeBisSkinChecked, 100);
      setTimeout(removeBisSkinChecked, 500);

      // Наблюдатель за изменениями DOM
      const observer = new MutationObserver(() => {
        removeBisSkinChecked();
      });
      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['bis_skin_checked']
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
        observer.disconnect();
      };
    }
  }, []);

  return <>{children}</>;
}

