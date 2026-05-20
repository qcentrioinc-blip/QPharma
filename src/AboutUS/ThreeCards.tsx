import React from "react";

type FeatureCard = {
    title: string;
    description: string;
};

const cards: FeatureCard[] = [
    {
        title: "100% AUTHENTIC\nPRODUCTS",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        title: "FAST\nDELIVERY",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        title: "AFFORDABLE\nPRICE",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
];

const ThreeCards: React.FC = () => {
    return (
        <section className="w-full bg-[#f4f4f4] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <div className="grid grid-cols-1 gap-[6px] md:grid-cols-3">
                    {cards.map((card) => (
                        <article
                            key={card.title}
                            className="flex min-h-[194px] flex-col rounded-[10px] bg-white px-[26px] pb-[24px] pt-[22px] shadow-[0_0_0_1px_rgba(0,0,0,0.03)]"
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="whitespace-pre-line text-[17px] font-extrabold uppercase leading-[1.15] tracking-[-0.02em] text-[#111111]">
                                    {card.title}
                                </h3>

                                <span className="h-[49px] w-[49px] shrink-0 rounded-full bg-[#648c3d]" />
                            </div>

                            <p className="mt-[44px] max-w-[300px] text-[13px] leading-[1.62] text-[#777777]">
                                {card.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ThreeCards;