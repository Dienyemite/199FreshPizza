import Header from "./components/header"
import Hero from "./components/hero"
import PromotionalBanner from "./components/promotional-banner"
import Menu from "./components/menu"
import About from "./components/about"
import Contact from "./components/contact"
import Footer from "./components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <PromotionalBanner />
        <Menu />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
