import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, Award, Heart } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Family Owned",
    description: "A local family business serving the community with passion.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every pizza is crafted with passion and the finest ingredients.",
  },
]

export default function About() {
  return (
    <section id="about" className="py-20 bg-anzac">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-cocoa-bean mb-6">About $1.99 FRESH PIZZA</h2>
            <p className="text-lg text-cocoa-bean mb-6 leading-relaxed">
              $1.99 FRESH PIZZA started with the goal of providing the Lyndhurst neighborhood with delicious, affordable and fresh NY-style pizza. 
            </p>
            <p className="text-lg text-cocoa-bean mb-8 leading-relaxed">
              We believe in using only the freshest ingredients, from our hand-tossed dough made daily to our signature
              sauce recipe. Every pizza is made with love.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-siam/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-siam" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-cocoa-bean mb-2">{feature.title}</h3>
                        <p className="text-sm text-ferra">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="/img/MultipleSlices.jpg"
              alt="Pizza slices at $1.99 Fresh Pizza"
              className="rounded-lg shadow-lg mt-8"
              width={1200}
              height={900}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
