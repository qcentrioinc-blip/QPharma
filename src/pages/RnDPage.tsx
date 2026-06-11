import Navbar from '../Global/Navbar';
import Footer from '../Global/Footer';
import Production from '../HomePage/Production';

const RnDPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="py-20">
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#b87a15]">Research & Development</h1>
                    <p className="text-gray-600 mt-4 max-w-2xl text-lg">
                        Our dedicated R&D team is constantly innovating to bring the most effective and safe pharmaceutical solutions to the global market.
                    </p>
                </div>
                {/* Note: In a real app, we might have a specific RnD component, but for now we reuse the Production cards */}
                <Production />
            </main>
            <Footer />
        </div>
    );
};

export default RnDPage;
