 
import Explore from "../../HomePage/Explore"
// import Gallery from "./Gallery"
import HeroSection from "./HeroSection"
import LorumTextAnim from "./LorumTextAnim"
import ManufacturingHighlight from "./ManufacturingHighlight"
import { TextParallaxContentExample } from "./TextParallaxContentExample"


const Production = () => {
  return (
    <div className="page-shell w-full">
      
      <HeroSection/>
      {/* <Gallery/> */}
      <TextParallaxContentExample/>
      <LorumTextAnim/>
            <ManufacturingHighlight/>
      <Explore/>
      
    </div>
  )
}

export default Production
