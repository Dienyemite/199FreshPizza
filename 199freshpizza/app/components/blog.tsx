import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "The Secret Behind Our Perfect Pizza Dough",
    excerpt:
      "Discover the time-honored techniques and premium ingredients that make our pizza dough irresistibly delicious.",
    image: "/images/buffalo-chicken-pizza.jpg",
    author: "Chef Mario",
    date: "March 15, 2024",
    category: "Recipes",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Farm to Table: Our Ingredient Journey",
    excerpt: "Learn about our partnerships with local farms and how we source the freshest ingredients for your pizza.",
    image: "/images/buffalo-chicken-pizza.jpg",
    author: "Sarah Johnson",
    date: "March 10, 2024",
    category: "Sustainability",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Pizza Pairing: Best Drinks for Every Slice",
    excerpt: "Expert recommendations on the perfect beverages to complement your favorite pizza flavors.",
    image: "/images/buffalo-chicken-pizza.jpg",
    author: "Tony Rodriguez",
    date: "March 5, 2024",
    category: "Tips",
    readTime: "4 min read",
  },
]

export default function Blog() {
  return (
    <section id="blog" className="py-20 bg-albescent-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-cocoa-bean mb-4">Latest from Our Blog</h2>
          <p className="text-xl text-ferra max-w-2xl mx-auto">
            Stories, tips, and insights from the world of pizza making
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-venus/20"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-cocoa-bean text-albescent-white px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 text-sm text-venus mb-3">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-cocoa-bean mb-3 group-hover:text-raw-sienna transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-ferra mb-4 line-clamp-3">{post.excerpt}</CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-venus">{post.readTime}</span>
                  <Button variant="ghost" className="text-siam hover:text-black-olive p-0">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-siam text-siam hover:bg-siam hover:text-albescent-white bg-transparent"
          >
            View All Posts
          </Button>
        </div>
      </div>
    </section>
  )
}
