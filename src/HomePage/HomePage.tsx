
// import AboutSection from './AboutSection';


import RelatedArticles from './RelatedArticles';
import Zephyr from './Zephyr';
import Explore from './Explore';
// import Production from './Production';

import FAQ from './FAQ';

import CTA from './CTA';
import Delivery from './Delivery';
import JointPain from './JointPain';
import Para from './Para';

const HomePage = () => {
    return (
        <div className="min-h-screen ">
           
            <main>
                <Zephyr />
                <JointPain />
                {/* <AboutSection /> */}
              
                <Explore />
                  <Para/> 
                {/* <Production /> */}
               <CTA />
               <Delivery />
                <FAQ />
                <RelatedArticles />
            </main> 
         
          
        </div>
    );
};

export default HomePage;
