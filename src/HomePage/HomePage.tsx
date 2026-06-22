import Navbar from '../Global/Navbar';
import Footer from '../Global/Footer';
import AboutSection from './AboutSection';


import RelatedArticles from './RelatedArticles';
import Zephyr from './Zephyr';
import Explore from './Explore';
// import Production from './Production';

import FAQ from './FAQ';

import CTA from './CTA';
import Delivery from './Delivery';
// import MainSec from './HeroCarousal/MainSec';
import MainSec from './MainSec';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* <Navbar /> */}
            <main>
                {/* <Zephyr /> */}
                <MainSec/>
                {/* <MainSec/> */}
                <AboutSection />
                <Explore />
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
