import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const questions = [
        "How long until we deliver your first blog post?",
        "How long until we deliver your first blog post?",
        "How long until we deliver your first blog post?",
        "How long until we deliver your first blog post?",
    ];

    return (
        <section className="py-12 bg-white font-sans antialiased">
            <div className="max-w-[1150px] mx-auto px-6">

                {/* Section Title */}
                <h2 className="text-[38px] text-[#333333] text-center font-normal mb-12 tracking-tight">
                    Frequently Ask Questions
                </h2>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

                    {/* Left Column: FAQ Accordion */}
                    <div className="w-full lg:w-[55%] space-y-3">
                        {questions.map((question, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full text-left px-6 py-[22px] flex items-center gap-5 group focus:outline-none"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                        <Plus
                                            strokeWidth={2.5}
                                            className={`w-[22px] h-[22px] text-[#24244b] transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}
                                        />
                                    </div>
                                    <span className="text-[17px] font-semibold text-[#24244b] leading-tight tracking-tight">
                                        {question}
                                    </span>
                                </button>

                                {/* Accordion Content Dropdown */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-16 text-gray-500 text-[15px] leading-relaxed">
                                        Our shipping and delivery times are carefully managed to ensure your first blog post reaches you exactly when you need it, maintaining high quality and professional standards.
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Any Questions / Contact */}
                    <div className="w-full lg:w-[45%] flex flex-col items-center">

                        {/* Question Blob Image */}
                        <div className="relative w-full max-w-[240px] mb-5">
                            <svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-sm">
                                {/* Outer stroke path for the double-border effect */}
                                <path
                                    fill="none"
                                    stroke="#000000"
                                    strokeWidth="5"
                                    d="M45.1,-75.6C58.8,-68.1,70.5,-55.8,78.2,-41.4C85.9,-27.1,89.6,-10.8,87.6,4.7C85.6,20.2,77.9,34.8,68.2,46.8C58.5,58.8,46.8,68.2,33.5,74.1C20.2,80,-5.3,82.4,-19.7,78.4C-34.1,74.4,-47.5,64.1,-58.5,52.1C-69.5,40.1,-78.2,26.4,-82.1,11.3C-86.1,-3.9,-85.3,-20.5,-78.9,-35C-72.5,-49.6,-60.5,-62.1,-46.5,-69.5C-32.5,-76.9,-16.2,-79.1,0.2,-79.4C16.6,-79.8,31.4,-83.1,45.1,-75.6Z"
                                    transform="translate(100 100) scale(1.08)"
                                />
                                {/* Main inner black fill */}
                                <path
                                    fill="#000000"
                                    d="M45.1,-75.6C58.8,-68.1,70.5,-55.8,78.2,-41.4C85.9,-27.1,89.6,-10.8,87.6,4.7C85.6,20.2,77.9,34.8,68.2,46.8C58.5,58.8,46.8,68.2,33.5,74.1C20.2,80,-5.3,82.4,-19.7,78.4C-34.1,74.4,-47.5,64.1,-58.5,52.1C-69.5,40.1,-78.2,26.4,-82.1,11.3C-86.1,-3.9,-85.3,-20.5,-78.9,-35C-72.5,-49.6,-60.5,-62.1,-46.5,-69.5C-32.5,-76.9,-16.2,-79.1,0.2,-79.4C16.6,-79.8,31.4,-83.1,45.1,-75.6Z"
                                    transform="translate(100 100)"
                                />
                                <text
                                    x="50%"
                                    y="53%"
                                    dominantBaseline="middle"
                                    textAnchor="middle"
                                    fill="white"
                                    className="font-bold font-sans"
                                    style={{ fontSize: '85px' }}
                                >
                                    ?
                                </text>
                            </svg>
                        </div>

                        <h3 className="text-[32px] font-bold text-black mb-2">Any Question?</h3>
                        <p className="text-black font-semibold text-[14px] mb-8 text-center">
                            You can ask anything you want to know Feedback
                        </p>

                        {/* Input Box */}
                        <div className="w-full max-w-[340px] text-left">
                            <label className="block text-black font-bold text-[12px] mb-1.5 tracking-wide">
                                Let me know
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Enter Here"
                                    className="w-full px-3 py-2.5 border border-gray-300 text-black placeholder-black text-[12px] font-semibold focus:outline-none focus:border-black transition-all"
                                />
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none hover:opacity-70 transition-opacity"
                                    aria-label="Clear input"
                                >
                                    <X strokeWidth={3} className="w-3.5 h-3.5 text-black" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;