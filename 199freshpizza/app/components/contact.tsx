import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import GoogleMap from "./google-map"

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["341 Ridge Road", "Lyndhurst, NJ 07071"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["201-256-3630"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["orders@hrbpizzeria.com"],
  },
  {
    icon: Clock,
    title: "Hours",
    details: ["Mon-Thu: 11AM-11PM", "Fri-Sun: 11AM-12AM"],
  },
]

// Restaurant address - you can change this to any address
const RESTAURANT_ADDRESS = "341 Ridge Road, Lyndhurst, NJ 07071"

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-cocoa-bean mb-4">Get in Touch</h2>
          <p className="text-xl text-ferra max-w-2xl mx-auto">
            Have questions or special requests? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-cocoa-bean mb-8">Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-none shadow-lg border-venus/20">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-siam/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-siam" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-cocoa-bean mb-2">{info.title}</h4>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-ferra">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Google Maps */}
            <Card className="shadow-lg border-venus/20">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-cocoa-bean flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-siam" />
                  Find Us Here
                </CardTitle>
                <CardDescription className="text-ferra">
                  Click on the map to get directions to our location
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <GoogleMap
                  address={RESTAURANT_ADDRESS}
                  height="300"
                  zoom={16}
                  className="rounded-b-lg overflow-hidden"
                />
              </CardContent>
            </Card>

            {/* Additional Location Info */}
            <div className="mt-6 p-4 bg-albescent-white rounded-lg">
              <h4 className="font-semibold text-cocoa-bean mb-2">Location Details</h4>
              <div className="text-sm text-ferra space-y-1">
                <p>🚗 Free parking available</p>
                <p>🚌 Near public transportation</p>
                <p>♿ Wheelchair accessible</p>
                <p>🏪 Located in the heart of Lyndhurst</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="shadow-lg border-venus/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-cocoa-bean">Send us a Message</CardTitle>
                <CardDescription className="text-ferra">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-cocoa-bean mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      placeholder="John"
                      className="w-full px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-cocoa-bean mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      placeholder="Doe"
                      className="w-full px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-cocoa-bean mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-cocoa-bean mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-cocoa-bean mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    className="w-full min-h-[120px] px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam resize-vertical"
                  ></textarea>
                </div>
                <Button className="w-full bg-siam hover:bg-black-olive text-albescent-white">Send Message</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
