// import Navbar from '../Global/Navbar';
import Footer from '../Global/Footer';
// import AboutSection from './AboutSection';


import RelatedArticles from './RelatedArticles';
// import Zephyr from './Zephyr';
import Explore from './Explore';
// import Production from './Production';

import FAQ from './FAQ';

import CTA from './CTA';
import Delivery from './Delivery';
import MainSec from './MainSec';
import JointPain from './JointPain';
import Para from './Para';
import NewFooter from '../Global/NewFooter';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* <Navbar /> */}
            <main>
                {/* <Zephyr /> */}
                <MainSec/>
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
            <Footer />
            <NewFooter />
          
        </div>
    );
};

export default HomePage;
