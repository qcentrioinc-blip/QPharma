import Footer from "../Global/Footer";
import Navbar from "../Global/Navbar";
import Duration from "./Duration";
import Experience from "./Experience";
import Free from "./Free";
import Mission from "./Mission";
// import Natural from "./Natural";
import ThreeCards from "./ThreeCards";
import TwoCards from "./TwoCards";

const AboutUS = () => {
    return (
        <div>
            <Navbar />
            <Experience />
            <TwoCards />
            <ThreeCards />
            <Mission />
            <Duration />
            <Free />
            {/* <Natural /> */}
            <Footer />
        </div>
    );
};

export default AboutUS;