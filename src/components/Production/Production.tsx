import Footer from "../../Global/Footer"
import Navbar from "../../Global/Navbar"
import Explore from "../../HomePage/Explore"
import Gallery from "./Gallery"
import HeroSection from "./HeroSection"
import LorumTextAnim from "./LorumTextAnim"
import ManufacturingHighlight from "./ManufacturingHighlight"


const Production = () => {
  return (
    <div>
         <Navbar/>
      <HeroSection/>
      <Gallery/>
      <ManufacturingHighlight/>
      <LorumTextAnim/>
      <Explore/>
      <Footer/>
    </div>
  )
}

export default Production
