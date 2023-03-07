import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import "../styles/globals.css";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <>
      <DefaultSeo
        openGraph={{
          type: "website",
          locale: "en_US",
          url: "https://emotional-recipes.com",
          siteName: "Emotional Recipes",
          images: [
            {
              url: "https://emotional-recipes.com/twitter-og-image.png",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
            },
          ],
        }}
        twitter={{
          handle: "@joelmturner",
          site: "@joelmturner",
          cardType: "summary_large_image",
        }}
        defaultTitle="Emotional Recipes"
      />
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Head>
          <title>Emotional Recipes</title>
        </Head>
        <Component {...pageProps} />
        <Analytics />
      </SessionContextProvider>
    </>
  );
}

export default MyApp;
