import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";

import Providers from "@/app/providers";
import { routing } from "@/i18n/routing";
import "./globals.css";


const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rank AI",
  description: "Rank AI is a platform for ranking and analyzing data.",
};

// Runs before the browser renders any body content — reads the locale from the
// URL path and sets the correct `dir` and `lang` on <html> synchronously so
// there is no RTL→LTR layout shift on English pages.
const directionScript = `(function(){
  var m=document.cookie.match(/NEXT_LOCALE=(\\w+)/);
  var locale=m?m[1]:'ar';
  document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  document.documentElement.lang=locale;
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Default to the app's default locale for the static shell; the inline
  // script above corrects both attributes before first paint on the client.
  const defaultLocale = routing.defaultLocale;

  return (
    <html
      lang={defaultLocale}
      dir="rtl"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} ${ibmPlexSansArabic.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: directionScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
