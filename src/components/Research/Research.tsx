import Footer from "../../Global/Footer"
import Navbar from "../../Global/Navbar"
import Explore from "../../HomePage/Explore"
 
import HeroSection from "./HeroSection"
import LorumText from "./LorumText"
import Stats from "./Stats"
import Timeline from "./Timeline"


const Research = () => {
  return (
    <div>
        <Navbar/>
        <HeroSection/>
        <Stats/>
        <Timeline/>
        <LorumText/>
        <Explore/>
        <Footer/>
      
    </div>
  )
}

export default Research
