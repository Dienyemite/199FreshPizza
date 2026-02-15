import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, Award, Heart } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Hot and fresh pizza delivered to your door in 30 minutes or less.",
  },
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
            <p className="text-lg text-ferra mb-6 leading-relaxed">
              $1.99 FRESH PIZZA started with the goal of providing the Lyndhurst neighborhood with delicious, affordable and fresh pizza. It is our guiding principle, and one that which is felt through every slice.
            </p>
            <p className="text-lg text-ferra mb-8 leading-relaxed">
              We believe in using only the freshest ingredients, from our hand-tossed dough made daily to our signature
              sauce recipe. Every pizza tells a story of quality, craft and love.
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
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1747654168933-a0a0c9d78d68?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Pizza making process"
                className="rounded-lg shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1718801594801-feba5ddcb2a4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Fresh ingredients"
                className="rounded-lg shadow-lg mt-8"
              />
              <img src="/images/buffalo-chicken-pizza.jpg" alt="Pizza oven" className="rounded-lg shadow-lg -mt-8" />
              <img src="https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&h=300&fit=crop&crop=center" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
