
import Explore from "../../HomePage/Explore"
 
import HeroSection from "./HeroSection"
import LorumText from "./LorumText"
import Stats from "./Stats"
import Timeline from "./Timeline"


const Research = () => {
  return (
    <div className="page-shell w-full">
     
        <HeroSection/>
        <Stats/>
        <Timeline/>
        <LorumText/>
        <Explore/>
        
      
    </div>
  )
}

export default Research
