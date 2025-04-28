import { useEffect } from 'react';

export function useAnalytics() {
  useEffect(() => {
    if (import.meta.env.MODE === 'development') return;
    // Google Analytics gtag.js script wordt al in index.html geladen
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-1L2Z0SPEJD');
  }, []);
}
