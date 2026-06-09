 
 
import ContactNav from '../../Global/ContactNav'
import Footer from '../../Global/Footer'
import Banner from './Banner'
 
import HeroSection from './HeroSection'
import Products from './Products'

const LandingPage = () => {
  return (
    <div>
    <ContactNav/>
      <HeroSection/>
      <Banner/>
      <Products/> 
      <Footer/>
    </div>
  )
}

export default LandingPage
