import Navbar from "../Navbar";
import Footer from "../Footer";

const HelpCenter = () => {
    const titleFont = { fontFamily: '"Cormorant Garamond", Georgia, serif' };

    const faqs = [
        {
            question: "How do I track my order?",
            answer: "You can track your order by visiting the 'Track Order' page and entering your Order ID and Email address. You'll receive real-time updates on your shipment status."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for most of our products. Items must be in their original packaging and unused. Please contact our support team to initiate a return."
        },
        {
            question: "Are your products 100% natural?",
            answer: "Yes, our herbal and organic products are made with 100% natural ingredients, sourced sustainably and tested for quality and purity."
        },
        {
            question: "How can I contact customer support?",
            answer: "You can reach us through our Customer Service page, via email at support@qpharma.com, or by calling our toll-free number during business hours."
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8f7f3]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#1E4734] px-4 py-16 md:py-24">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute left-[-5%] top-[-10%] h-64 w-64 rounded-full bg-[#7D9851] blur-3xl" />
                    <div className="absolute right-[-5%] bottom-[-10%] h-64 w-64 rounded-full bg-[#4f7d22] blur-3xl" />
                </div>

                {/* Dot Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                <div className="relative mx-auto max-w-[1180px] text-center">
                    <h1
                        style={titleFont}
                        className="text-[42px] font-bold leading-tight text-white sm:text-[52px] md:text-[64px]"
                    >
                        Help Center
                    </h1>
                    <p className="mx-auto mt-6 max-w-[700px] text-[18px] leading-relaxed text-white/80">
                        Find answers to frequently asked questions and learn more about our services, products, and policies.
                    </p>

                    <div className="mt-10 flex justify-center">
                        <div className="relative w-full max-w-[600px]">
                            <input
                                type="text"
                                placeholder="Search for help..."
                                className="w-full rounded-2xl border-none bg-white/10 px-6 py-4 text-white placeholder:text-white/50 backdrop-blur-md focus:ring-2 focus:ring-[#7D9851] outline-none"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-[#7D9851] px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-[#8FC44B]">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="mx-auto max-w-[1180px] px-4 py-20">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    {/* Sidebar/Categories */}
                    <div className="md:col-span-1">
                        <h3 className="mb-6 text-[20px] font-bold text-[#1E4734]">Categories</h3>
                        <ul className="space-y-4">
                            {['General Info', 'Order & Shipping', 'Returns & Refunds', 'Product Safety', 'Account Settings'].map((cat) => (
                                <li key={cat}>
                                    <button className="text-[16px] text-[#4a5a42] transition hover:text-[#7D9851] hover:translate-x-1 duration-200">
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-12 rounded-2xl bg-[#7D9851]/10 p-6">
                            <h4 className="mb-2 font-bold text-[#1E4734]">Need more help?</h4>
                            <p className="mb-4 text-sm text-[#4a5a42]">Our team is always here to assist you with any questions.</p>
                            <button className="w-full rounded-xl bg-[#1E4734] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#2a5a42]">
                                Contact Support
                            </button>
                        </div>
                    </div>

                    {/* Main FAQs */}
                    <div className="md:col-span-2">
                        <h2 className="mb-10 text-[32px] font-bold text-[#1E4734]" style={titleFont}>Frequently Asked Questions</h2>

                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div key={index} className="rounded-2xl border border-[#e8f0d8] bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                    <h4 className="mb-3 text-[18px] font-bold text-[#1E4734]">{faq.question}</h4>
                                    <p className="text-[16px] leading-relaxed text-[#4a5a42]">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HelpCenter;
