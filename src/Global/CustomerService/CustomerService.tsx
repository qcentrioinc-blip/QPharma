import Navbar from "../Navbar";
import Footer from "../Footer";

const CustomerService = () => {
    const titleFont = { fontFamily: '"Cormorant Garamond", Georgia, serif' };

    return (
        <div className="min-h-screen bg-[#f8f7f3]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#1E4734] to-[#2a5a42] px-4 py-16 md:py-24">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute left-[10%] top-[20%] h-48 w-48 rounded-full bg-[#7D9851] blur-3xl" />
                    <div className="absolute right-[10%] top-[40%] h-64 w-64 rounded-full bg-[#4f7d22] blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-[1180px] text-center">
                    <h1
                        style={titleFont}
                        className="text-[42px] font-bold leading-tight text-white sm:text-[52px] md:text-[64px]"
                    >
                        Customer Service
                    </h1>
                    <p className="mx-auto mt-6 max-w-[700px] text-[18px] leading-relaxed text-white/80">
                        We're here to help! Whether you have a question about our products, an order, or just want to say hello, our team is ready to assist you.
                    </p>
                </div>
            </section>

            {/* Contact Options */}
            <section className="mx-auto max-w-[1180px] px-4 py-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Contact Cards */}
                    {[
                        {
                            title: "Email Us",
                            desc: "Send us a message anytime and we'll respond within 24 hours.",
                            info: "support@qpharma.com",
                            icon: "📧"
                        },
                        {
                            title: "Call Us",
                            desc: "Talk to our experts Monday through Friday, 9am - 6pm.",
                            info: "+1 (800) 123-4567",
                            icon: "📞"
                        },
                        {
                            title: "Visit Us",
                            desc: "Check out our main office for corporate inquiries.",
                            info: "123 Pharma Plaza, Wellness City",
                            icon: "📍"
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm border border-[#e8f0d8] transition-transform hover:-translate-y-1">
                            <span className="mb-4 text-4xl">{item.icon}</span>
                            <h3 className="mb-2 text-[20px] font-bold text-[#1E4734]">{item.title}</h3>
                            <p className="mb-4 text-sm text-[#7a8c71]">{item.desc}</p>
                            <p className="font-semibold text-[#7D9851]">{item.info}</p>
                        </div>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="mt-20 overflow-hidden rounded-3xl bg-white shadow-xl border border-[#e8f0d8]">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="bg-[#1E4734] p-12 text-white">
                            <h2 style={titleFont} className="mb-6 text-[36px] font-bold">Send us a message</h2>
                            <p className="mb-8 text-white/70">Fill out the form and our support representative will get back to you as soon as possible.</p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">✨</div>
                                    <span>Fast response times</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">🌱</div>
                                    <span>Expert product advice</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">🧪</div>
                                    <span>Quality assurance support</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-12">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#4a5a42]">Full Name</label>
                                        <input type="text" className="w-full rounded-xl border border-[#d8e0cc] px-4 py-3 focus:border-[#7D9851] focus:outline-none transition-colors" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#4a5a42]">Email Address</label>
                                        <input type="email" className="w-full rounded-xl border border-[#d8e0cc] px-4 py-3 focus:border-[#7D9851] focus:outline-none transition-colors" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#4a5a42]">Subject</label>
                                    <select className="w-full rounded-xl border border-[#d8e0cc] px-4 py-3 focus:border-[#7D9851] focus:outline-none transition-colors">
                                        <option>General Inquiry</option>
                                        <option>Order Status</option>
                                        <option>Product Question</option>
                                        <option>Returns & Exchanges</option>
                                        <option>Feedback</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#4a5a42]">Message</label>
                                    <textarea rows={4} className="w-full rounded-xl border border-[#d8e0cc] px-4 py-3 focus:border-[#7D9851] focus:outline-none transition-colors" placeholder="How can we help you?"></textarea>
                                </div>
                                <button className="w-full rounded-xl bg-[#7D9851] py-4 font-bold text-white shadow-lg transition-all hover:bg-[#8FC44B] hover:shadow-xl active:scale-[0.98]">
                                    Submit Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CustomerService;
