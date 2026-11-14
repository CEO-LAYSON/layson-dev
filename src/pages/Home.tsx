import Hero from '../sections/Hero'
import Marquee from '../sections/Marquee'
import About from '../sections/About'
import Experience from '../sections/Experience'
import Work from '../sections/Work'
import Toolbox from '../sections/Toolbox'
import Lab from '../sections/Lab'
import Services from '../sections/Services'
import Writing from '../sections/Writing'
import Contact from '../sections/Contact'
import { Seo } from '../components/ui'

export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <Marquee />
      <About />
      <Experience />
      <Work />
      <Toolbox />
      <Lab />
      <Services />
      <Writing />
      <Contact />
    </>
  )
}
