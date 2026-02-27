"use client"

import { useState } from "react"
import { MapPin, ExternalLink } from "lucide-react"

interface GoogleMapProps {
  address: string
  width?: string
  height?: string
  zoom?: number
  className?: string
}

export default function GoogleMap({
  address,
  width = "100%",
  height = "300",
  zoom = 15,
  className = "",
}: GoogleMapProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const encodedAddress = encodeURIComponent(address)
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.11431368459391!3d40.81207997932823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f0d6cfc94dd5%3A0x40a14484fb7c030a!2s341%20Ridge%20Rd%2C%20Lyndhurst%2C%20NJ%2007071!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      {isLoaded ? (
        <iframe
          src={mapSrc}
          width={width}
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg shadow-lg w-full h-full"
          title={`Map showing location of ${address}`}
        />
      ) : (
        <div
          className="w-full h-full rounded-lg shadow-lg bg-gray-100 flex flex-col items-center justify-center gap-4 border border-venus/20 cursor-pointer"
          style={{ minHeight: `${height}px` }}
          onClick={() => setIsLoaded(true)}
          role="button"
          tabIndex={0}
          aria-label="Load interactive map"
          onKeyDown={(e) => e.key === "Enter" && setIsLoaded(true)}
        >
          <div className="w-16 h-16 bg-siam/10 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-siam" />
          </div>
          <div className="text-center px-4">
            <p className="font-semibold text-cocoa-bean mb-1">341 Ridge Road</p>
            <p className="text-sm text-ferra">Lyndhurst, NJ 07071</p>
          </div>
          <button
            className="bg-siam text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-black-olive transition-colors"
            onClick={(e) => { e.stopPropagation(); setIsLoaded(true) }}
          >
            Click to load map
          </button>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-siam hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  )
}
