import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from "next/script"
import "./globals.css"
import { CartProvider } from "./context/cart-context"

const interFont = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const monoFont = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" })

export const metadata: Metadata = {
  title: "$1.99 FRESH PIZZA - Best Pizza in Lyndhurst, NJ | Order Online",
  description:
    "Order fresh, delicious pizza from $1.99 FRESH PIZZA in Lyndhurst, NJ. Fast delivery, authentic flavors, and unbeatable prices. Call (201) 256-3630 or order online!",
  keywords: [
    "pizza delivery Lyndhurst NJ",
    "fresh pizza Lyndhurst",
    "cheap pizza near me",
    "pizza restaurant Lyndhurst",
    "Ridge Road pizza",
    "pizza delivery 07071",
    "best pizza Lyndhurst",
    "online pizza ordering",
    "pizza slices Lyndhurst",
    "beef patty Lyndhurst",
  ].join(", "),
  authors: [{ name: "$1.99 FRESH PIZZA" }],
  creator: "$1.99 FRESH PIZZA",
  publisher: "$1.99 FRESH PIZZA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.199freshpizza.com",
    siteName: "$1.99 FRESH PIZZA",
    title: "$1.99 FRESH PIZZA - Best Pizza in Lyndhurst, NJ",
    description:
      "Order fresh, delicious pizza from $1.99 FRESH PIZZA in Lyndhurst, NJ. Fast delivery, authentic flavors, and unbeatable prices.",
    images: [
      {
        url: "/images/buffalo-chicken-pizza.jpg",
        width: 1200,
        height: 630,
        alt: "$1.99 FRESH PIZZA - Delicious Pizza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "$1.99 FRESH PIZZA - Best Pizza in Lyndhurst, NJ",
    description:
      "Order fresh, delicious pizza from $1.99 FRESH PIZZA in Lyndhurst, NJ. Fast delivery, authentic flavors, and unbeatable prices.",
    images: ["/images/buffalo-chicken-pizza.jpg"],
  },
  alternates: {
    canonical: "https://www.199freshpizza.com",
  },
  other: {
    "business:contact_data:street_address": "341 Ridge Road",
    "business:contact_data:locality": "Lyndhurst",
    "business:contact_data:region": "NJ",
    "business:contact_data:postal_code": "07071",
    "business:contact_data:country_name": "United States",
    "business:contact_data:phone_number": "(201) 256-3630",
    "business:contact_data:website": "https://www.199freshpizza.com",
    "google-site-verification": "your-verification-code",
    "msvalidate.01": "your-bing-verification-code",
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "$1.99 FRESH PIZZA",
  image: "https://www.199freshpizza.com/images/buffalo-chicken-pizza.jpg",
  description:
    "Fresh, delicious pizza restaurant in Lyndhurst, NJ offering delivery and pickup with unbeatable prices.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "341 Ridge Road",
    addressLocality: "Lyndhurst",
    addressRegion: "NJ",
    postalCode: "07071",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.8120799,
    longitude: -74.1143136,
  },
  telephone: "(201) 256-3630",
  url: "https://www.199freshpizza.com",
  openingHours: ["Mo-Th 11:00-23:00", "Fr-Su 11:00-24:00"],
  servesCuisine: "Pizza",
  priceRange: "$",
  acceptsReservations: false,
  hasDeliveryService: true,
  hasTakeaway: true,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "500",
  },
  menu: "https://www.199freshpizza.com/#menu",
  sameAs: [
    "https://www.doordash.com/store/$1.99-fresh-pizza-lyndhurst-32783939/73652746/",
    "https://www.grubhub.com/restaurant/199-fresh-pizza-341-ridge-rd-lyndhurst/11840792",
    "https://www.seamless.com/menu/199freshpizza-341-ridge-rd-lyndhurst/11840792",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${interFont.variable} ${monoFont.variable}`}>
      <body>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <Script src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_TRACKING_ID');
          `}
        </Script>

        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
