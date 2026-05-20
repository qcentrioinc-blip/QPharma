import React from "react";

type MissionContent = {
    heading: string;
    paragraphs: string[];
    image: string;
    imageAlt: string;
};

const content: MissionContent = {
    heading: "OUR MISSION AND VISION",
    paragraphs: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    ],
    image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Aerial city buildings view",
};

const Mission: React.FC = () => {
    return (
        <section className="w-full bg-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl rounded-[8px] bg-white pb-4">
                <div className="px-0">
                    <h2 className="text-[18px] font-extrabold uppercase tracking-[-0.02em] text-[#111111] sm:text-[20px]">
                        {content.heading}
                    </h2>

                    <div className="mt-[26px] max-w-full space-y-1 text-[13px] leading-[2] text-[#202020] sm:text-[14px]">
                        <p>{content.paragraphs[0]}</p>
                        <p>{content.paragraphs[1]}</p>
                    </div>
                </div>

                <div className="mt-[28px] overflow-hidden rounded-[14px]">
                    <img
                        src={content.image}
                        alt={content.imageAlt}
                        className="h-[260px] w-full object-cover sm:h-[340px] md:h-[410px] lg:h-[430px]"
                        loading="lazy"
                    />
                </div>

                <div className="mt-[30px] h-px w-full bg-[#e9e9e9]" />
            </div>
        </section>
    );
};

export default Mission;