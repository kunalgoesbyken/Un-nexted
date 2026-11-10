/**
 * Client Hydration Entry Point
 * Attaches React event listeners to server-rendered HTML
 */

import { hydrateRoot } from 'react-dom/client';
import { createElement } from 'react';
import pages from 'unnexted:pages';

/**
 * Read server-side data from __UNNEXTED_DATA__ script tag
 */
function getServerData(): { pathname: string; props: Record<string, any>; filePath?: string } | null {
  const dataScript = document.getElementById('__UNNEXTED_DATA__');
  if (!dataScript) {
    console.warn('[Client] No server data found');
    return null;
  }

  try {
    return JSON.parse(dataScript.textContent || '{}');
  } catch (e) {
    console.error('[Client] Failed to parse server data:', e);
    return null;
  }
}

/**
 * Hydrate the application
 */
async function hydrate(): Promise<void> {
  console.log('[Client] Starting hydration...');

  const serverData = getServerData();
  if (!serverData) {
    console.error('[Client] No server data available, cannot hydrate');
    return;
  }

  const { pathname, props, filePath } = serverData;
  const loadPage = filePath ? pages[filePath] : undefined;
  if (!loadPage) {
    console.error('[Client] No page registered for route:', pathname);
    return;
  }

  console.log('[Client] Hydrating route:', pathname, 'with props:', props);

  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('[Client] Root element not found');
    return;
  }

  const { default: Component } = await loadPage();
  hydrateRoot(rootElement, createElement(Component, props));

  console.log('[Client] Hydration complete!');
}

// Start hydration when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate);
  } else {
    hydrate();
  }
}
