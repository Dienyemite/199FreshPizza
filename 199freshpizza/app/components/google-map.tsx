"use client"

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
  // Encode the address for URL
  const encodedAddress = encodeURIComponent(address)

  // Use Google Maps embed without API key (basic embed)
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.11431368459391!3d40.81207997932823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f0d6cfc94dd5%3A0x40a14484fb7c030a!2s341%20Ridge%20Rd%2C%20Lyndhurst%2C%20NJ%2007071!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus`

  // Alternative: Simple iframe embed URL (works without API key)
  const simpleMapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`

  return (
    <div className={`relative ${className}`}>
      <iframe
        src={simpleMapSrc}
        width={width}
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg shadow-lg w-full"
        title={`Map showing location of ${address}`}
      />

      {/* Fallback link if iframe doesn't work */}
      <div className="absolute bottom-2 right-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/90 hover:bg-white text-cocoa-bean text-xs px-2 py-1 rounded shadow-md transition-colors"
        >
          View in Google Maps
        </a>
      </div>
    </div>
  )
}
