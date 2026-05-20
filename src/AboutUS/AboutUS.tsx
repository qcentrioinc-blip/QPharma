import Duration from "./Duration";
import Experience from "./Experience";
import Free from "./Free";
import Mission from "./Mission";
import Natural from "./Natural";
import ThreeCards from "./ThreeCards";
import TwoCards from "./TwoCards";

const AboutUS = () => {
    return (
        <div>
            <Experience />
            <TwoCards />
            <ThreeCards />
            <Mission />
            <Duration />
            <Free />
            <Natural />
        </div>
    );
};

export default AboutUS;