import Navbar from '../Global/Navbar';
import Footer from '../Global/Footer';
import AboutSection from './AboutSection';
import LorumIpsumSection from './LorumIpsumSection';
import FAQ from './FAQ';
import RelatedArticles from './RelatedArticles';
import Zephyr from './Zephyr';
import Explore from '../ProductPage/Explore';
import Production from './Production';
import Promotion from './Promotion';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Zephyr />
                <AboutSection />
                <Explore />
                <Production />
                <LorumIpsumSection />
                <Promotion />
                <FAQ />
                <RelatedArticles />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
