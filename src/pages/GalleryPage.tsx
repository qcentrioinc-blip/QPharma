import Navbar from '../Global/Navbar';
import Footer from '../Global/Footer';

const GalleryPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">Our Gallery</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-16">
                        A visual journey through our laboratories, facilities, and the dedicated people behind QPharma.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-sm group">
                                <img
                                    src={`https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&w=600&q=80&sig=${i}`}
                                    alt={`Gallery image ${i}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GalleryPage;
