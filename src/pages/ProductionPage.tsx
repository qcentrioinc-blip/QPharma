import Navbar from '../Global/Navbar';
import Footer from '../Global/Footer';
import Production from '../HomePage/Production';

const ProductionPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="py-20">
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#1a472a]">Production & Facilities</h1>
                    <p className="text-gray-600 mt-4 max-w-2xl text-lg">
                        Explore our state-of-the-art production facilities where quality meets precision in every pharmaceutical solution we create.
                    </p>
                </div>
                <Production />
            </main>
            <Footer />
        </div>
    );
};

export default ProductionPage;
