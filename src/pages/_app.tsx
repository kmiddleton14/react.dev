/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useEffect} from 'react';
import {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import Script from 'next/script';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  window.gtag = function () {
    // @ts-ignore
    window.dataLayer.push(arguments);
  };
  // @ts-ignore
  gtag('js', new Date());
}

export default function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Taken from StackOverflow. Trying to detect both Safari desktop and mobile.
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      // This is kind of a lie.
      // We still rely on the manual Next.js scrollRestoration logic.
      // However, we *also* don't want Safari grey screen during the back swipe gesture.
      // Seems like it doesn't hurt to enable auto restore *and* Next.js logic at the same time.
      history.scrollRestoration = 'auto';
    } else {
      // For other browsers, let Next.js set scrollRestoration to 'manual'.
      // It seems to work better for Chrome and Firefox which don't animate the back swipe.
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const cleanedUrl = url.split(/[\?\#]/)[0];
      // @ts-ignore
      gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
        page_path: cleanedUrl,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Component {...pageProps} />
      {process.env.NODE_ENV === 'production' && (
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
        />
      )}
    </>
  );
}
