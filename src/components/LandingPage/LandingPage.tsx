 
 
import ContactNav from '../../Global/ContactNav'
import Footer from '../../Global/Footer'
import Banner from './Banner'
import CTA from './CTA'
import Delivery from './Delivery'
import FAQ from './FAQ'
 
import HeroSection from './HeroSection'
import ImageBanner from './ImageBanner'
import Products from './Products'

const LandingPage = () => {
  return (
    <div>
    <ContactNav/>
      <HeroSection/>
      <Banner/>
      <Products/> 
      <ImageBanner/>
      <CTA/>
      <Delivery/>
      <FAQ/>
      <Footer/>                                
    </div>
  )
}

export default LandingPage
