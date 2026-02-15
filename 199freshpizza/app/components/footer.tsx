import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black-olive text-albescent-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-cocoa-bean rounded-full flex items-center justify-center">
                <span className="text-albescent-white font-bold text-xl">🍕</span>
              </div>
              <span className="text-2xl font-bold">$1.99 FRESH PIZZA</span>
            </div>
            <p className="text-venus mb-6">Serving delicious, authentic pizzas. Made with love, delivered with care.</p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-venus hover:text-albescent-white cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-venus hover:text-albescent-white cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-venus hover:text-albescent-white cursor-pointer transition-colors" />
              <Youtube className="w-6 h-6 text-venus hover:text-albescent-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-venus hover:text-albescent-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-venus hover:text-albescent-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#menu" className="text-venus hover:text-albescent-white transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="#contact" className="text-venus hover:text-albescent-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Menu Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Menu</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-venus hover:text-albescent-white transition-colors">
                  Classic Pizzas
                </a>
              </li>
              <li>
                <a href="#" className="text-venus hover:text-albescent-white transition-colors">
                  Specialty Pizzas
                </a>
              </li>
              <li>
                <a href="#" className="text-venus hover:text-albescent-white transition-colors">
                  Specials
                </a>
              </li>
              <li>
                <a href="#" className="text-venus hover:text-albescent-white transition-colors">
                  Appetizers
                </a>
              </li>
              <li>
                <a href="#" className="text-venus hover:text-albescent-white transition-colors">
                  Desserts
                </a>
              </li>
              <li>
                <a href="#" className="text-venus hover:text-albescent-white transition-colors">
                  Beverages
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-3">
              <p className="text-venus">
                341 Ridge Road
                <br />
                Lyndhurst, NJ 07071
              </p>
              <p className="text-venus">Phone: (201)-256-3630</p>
              <p className="text-venus">Email: orders@hrbpizzeria.com</p>
              <p className="text-venus">
                Hours: Mon-Thu 11AM-11PM
                <br />
                Fri-Sun 11AM-12AM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-ferra mt-12 pt-8 text-center">
          <p className="text-venus">
            © 2025 $1.99 FRESH PIZZA. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  )
}
