 
 
import ContactNav from '../../Global/ContactNav'
import Footer from '../../Global/Footer'
import Banner from './Banner'
import CTA from '../../HomePage/CTA'
import Delivery from '../../HomePage/Delivery'

 
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
    
      <Footer/>                                
    </div>
  )
}

export default LandingPage
