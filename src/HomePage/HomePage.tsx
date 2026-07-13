
// import Navbar from '../Global/Navbar';

// import AboutSection from './AboutSection';


import RelatedArticles from './RelatedArticles';
// import Zephyr from './Zephyr';
import Explore from './Explore';
// import Production from './Production';

import FAQ from './FAQ';

import CTA from './CTA';
// import Delivery from './Delivery';
import MainSec from './MainSec';
import JointPain from './JointPain';
// import Para from './Para';
// import NewFooter from '../Global/NewFooter';
import ShowreelSection from './ShowreelSection';
import FeaturesSection from './FeaturesSection';
// import { EtCtaSection } from './EtCtaSection';
// import AnimatedSec from './AnimatedSec';
import Table from './Table';

const HomePage = () => {
    return (
  
           
        <div className="min-h-screen">
            {/* <Navbar /> */}
            <main>
                {/* <Zephyr /> */}
                <MainSec/>
                <JointPain />
                {/* <EtCtaSection/> */}
                {/* <AboutSection /> */}
              
                <Explore />
                <FeaturesSection/>
                <ShowreelSection/>
                  {/* <Para/>  */}
                {/* <Production /> */}
               <CTA />
               {/* <Delivery /> */}
                <FAQ />
                <Table/>
                {/* <AnimatedSec /> */}
                <RelatedArticles />
            </main> 
         
         
            
            {/* <NewFooter /> */}
          
        </div>
    );
};

export default HomePage;
