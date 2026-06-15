import { Platform } from 'react-native';

const APP_NAME = 'Fractional Bill Pay';
const THEME_COLOR = '#0A1628';

function upsertMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  const selector = `meta[${attribute}="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, extraAttributes: Record<string, string> = {}) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
  Object.entries(extraAttributes).forEach(([key, value]) => element?.setAttribute(key, value));
}

function addGlobalStyles() {
  if (document.getElementById('fractional-web-app-styles')) return;

  const style = document.createElement('style');
  style.id = 'fractional-web-app-styles';
  style.textContent = `
    html,
    body,
    #root {
      width: 100%;
      min-height: 100%;
      margin: 0;
      background: ${THEME_COLOR};
    }

    html {
      height: 100%;
      -webkit-text-size-adjust: 100%;
    }

    body {
      min-height: 100dvh;
      overflow: hidden;
      overscroll-behavior: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      touch-action: manipulation;
      padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    }

    * {
      box-sizing: border-box;
    }

    input,
    textarea,
    select {
      font-size: 16px;
    }
  `;
  document.head.appendChild(style);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const isSecureOrigin = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  if (!isSecureOrigin) return;

  navigator.serviceWorker.register('/service-worker.js').catch(() => {
    // The app should still run normally if service worker registration is unavailable.
  });
}

export function setupWebAppDocument() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  document.title = APP_NAME;
  upsertMeta(
    'viewport',
    'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no'
  );
  upsertMeta('theme-color', THEME_COLOR);
  upsertMeta('apple-mobile-web-app-capable', 'yes');
  upsertMeta('mobile-web-app-capable', 'yes');
  upsertMeta('apple-mobile-web-app-title', APP_NAME);
  upsertMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  upsertMeta('application-name', APP_NAME);
  upsertMeta('format-detection', 'telephone=no');
  upsertMeta('og:title', APP_NAME, 'property');
  upsertMeta('og:type', 'website', 'property');

  upsertLink('manifest', '/manifest.json');
  upsertLink('icon', '/favicon.png', { type: 'image/png' });
  upsertLink('apple-touch-icon', '/apple-touch-icon.png');

  addGlobalStyles();
  registerServiceWorker();
}
