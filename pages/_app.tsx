import type { AppProps } from "next/app";

import NProgress from "nprogress";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Script from "next/script";
import "../styles/nprogress.css";
import "../styles/globals.css";
import { FC, useEffect, useRef } from "react";
import { pageview } from "../utils/helpers/googleAnalytics";
import { ManagedUIContext, useUI } from "../components/context";

const TopProgressBar = dynamic(
  () => {
    return import("../components/common/TopProgressBar");
  },
  { ssr: false }
);

const CookieConsentFooter = dynamic(
  () => {
    return import("../components/common/CookieConsentFooter");
  },
  { ssr: false }
);

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script async  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
      <Script
        async
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                page_path: window.location.pathname,
              });
          `,
        }}
      />
      <Script
        async
        data-ad-client="ca-pub-2076812817349157"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      />

      <Script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" />
      <Script
      async
        dangerouslySetInnerHTML={{
          __html: `
              var googletag = googletag || {}; 
              googletag.cmd = googletag.cmd || [];
          `,
        }}
      />

      <TopProgressBar />
      <ManagedUIContext>
        <TransitionHandler>
          <Component {...pageProps} />
        </TransitionHandler>
      </ManagedUIContext>
      <CookieConsentFooter />
    </>
  );
}

const TransitionHandler: FC = ({ children }) => {
  const router = useRouter();
  const { setIsTransitioning, isTransitioning } = useUI();

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current && isTransitioning) {
      setIsTransitioning(false);
    }
  }, [isTransitioning, setIsTransitioning]);

  useEffect(() => {
    const handleRouteChangeStart = (url: string, { shallow }: { shallow: boolean }) => {
      setIsTransitioning(true);
      // destroy all ad slots
      if (!shallow && !firstRender.current) {
        //@ts-ignore
        const { googletag } = window;
        googletag.cmd.push(function () {
          googletag.destroySlots();
        });
      }
      firstRender.current = false;
    };

    const handleRouteChangeComplete = (url: string) => {
      setIsTransitioning(false);
      pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.events, setIsTransitioning]);
  return <>{children}</>;
};

export default MyApp;
