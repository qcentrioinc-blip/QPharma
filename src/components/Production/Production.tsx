 
import Explore from "../../HomePage/Explore"
import Gallery from "./Gallery"
import HeroSection from "./HeroSection"
import LorumTextAnim from "./LorumTextAnim"
import ManufacturingHighlight from "./ManufacturingHighlight"


const Production = () => {
  return (
    <div className="px-4">
        
      <HeroSection/>
      <Gallery/>
      <ManufacturingHighlight/>
      <LorumTextAnim/>
      <Explore/>
      
    </div>
  )
}

export default Production
