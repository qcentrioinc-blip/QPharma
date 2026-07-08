import { useState } from "react";
import { Link } from "react-router-dom";

// Local Typography components as placeholders
const H1 = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <h1 className={`text-4xl md:text-6xl font-bold ${className}`}>{children}</h1>
);

const H3 = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <h3 className={`text-lg md:text-xl font-medium ${className}`}>{children}</h3>
);

const aboutPanels = [
    {
        id: "01",
        title: "OUR LOGO",
        stat: "E",
        description: "Symbolizing Harmony & Growth",
        image: "/Global/about_logo.png",
        link: "/aboutus",
        fullText: "Our logo represents the cyclical nature of wellness and our commitment to sustainable health solutions."
    },
    {
        id: "02",
        title: "OUR STORY",
        stat: "2025",
        description: "Since 2025",
        image: "/Global/about_story.png",
        link: "/aboutus",
        fullText: "At QPharma, we believe the heart of wellness is accessible science. We bring you thoughtfully researched, high-quality pharmaceuticals that make living healthier easier and smarter."
    },
    {
        id: "03",
        title: "CRAFTED WITH CARE",
        stat: "1",
        description: "Quality Precision",
        image: "/Global/about_crafted.png",
        link: "/aboutus",
        fullText: "Our experts work with high-quality ingredients -- from eco-conscious extracts to advanced formulations -- ensuring your health tools are as reliable as they are effective."
    },
    {
        id: "04",
        title: "TRADITIONAL TREND",
        stat: "2",
        description: "Modern Heritage",
        image: "/Global/about_trend.png",
        link: "/aboutus",
        fullText: "We blend timeless wisdom with modern technology. Whether it's a traditional remedy or a cutting-edge drug, our products are made to spark vitality and turn daily care into a celebration of life."
    }
];

const AboutSection = () => {
    const [active, setActive] = useState(0);

    return (
        <section className="w-full bg-white py-20">
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-[#113227]">About Us</h2>
            </div>

            <div className="flex flex-col lg:flex-row h-[600px] max-w-[1400px] mx-auto px-4 gap-2">
                {/* Accordion Panels */}
                <div className="flex flex-1 overflow-hidden rounded-3xl">
                    {aboutPanels.map((item, index) => {
                        const isActive = active === index;

                        return (
                            <div
                                key={item.id}
                                onMouseEnter={() => setActive(index)}
                                className={`
                  relative overflow-hidden cursor-pointer
                  transition-[flex-grow] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
                  border-l border-white/10 first:border-l-0
                  ${isActive ? "flex-[3]" : "flex-1"}
                `}
                            >
                                {/* Background Image / Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-b from-[#113227] to-[#1a4d3d] transition-all duration-700`} />

                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className={`
                    absolute inset-0 h-full w-full object-cover
                    transition-all duration-1000 ease-out
                    ${isActive ? "opacity-100 scale-105" : "opacity-40 scale-105"}
                  `}
                                />

                                {/* Overlay */}
                                <div className={`absolute inset-0 bg-black/30 transition-opacity duration-700 ${isActive ? "opacity-40" : "opacity-0"}`} />

                                {/* Number/ID */}
                                <div className="absolute top-8 left-8 z-20">
                                    <span className="text-white text-xl font-bold opacity-80">
                                        {item.id}
                                    </span>
                                </div>

                                {/* Vertical Title when collapsed */}
                                {!isActive && (
                                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                                        <H3 className="text-white text-sm uppercase tracking-[0.4em] [writing-mode:vertical-rl] rotate-180">
                                            {item.title}
                                        </H3>
                                    </div>
                                )}

                                {/* Expanded Content */}
                                <div
                                    className={`
                    absolute bottom-12 left-10 right-10 z-20
                    transition-all duration-700 delay-100
                    ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
                  `}
                                >
                                    <H1 className="text-white text-5xl md:text-7xl font-bold mb-4">
                                        {item.stat}
                                    </H1>

                                    <h4 className="text-white text-2xl font-bold mb-2 uppercase tracking-wide">{item.title}</h4>
                                    <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed mb-6">
                                        {item.fullText}
                                    </p>

                                    <div className="mt-6">
                                        <Link
                                            to={item.link}
                                            className="group inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-3 font-medium text-white backdrop-blur-md transition-all duration-300 hover:gap-3 hover:border-white hover:bg-white/20"
                                        >
                                            Explore More
                                            <svg className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden p-4 space-y-4">
                {aboutPanels.map((item) => (
                    <div key={item.id} className="relative rounded-3xl overflow-hidden h-[400px]">
                        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="text-white text-sm font-bold mb-2 opacity-70">{item.id}</div>
                            <h3 className="text-white text-5xl font-bold mb-2">{item.stat}</h3>
                            <h4 className="text-white text-xl font-bold mb-2 uppercase">{item.title}</h4>
                            <p className="text-white/80 text-sm line-clamp-3">{item.fullText}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutSection;
