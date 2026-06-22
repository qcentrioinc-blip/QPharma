import Navbar from '../Global/Navbar';
import Footer from '../Global/Footer';
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
            <Navbar />
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
            <Footer />
          
        </div>
    );
};

export default HomePage;
