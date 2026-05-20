import React from "react";

type CardContent = {
    title: string;
    description: string;
    buttonText: string;
};

const content: CardContent = {
    title: "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISICING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT",
    description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonText: "OUR SHOWREEL",
};

const TwoCards: React.FC = () => {
    return (
        <section className="w-full bg-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl rounded-[10px] p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="relative h-[230px] overflow-hidden rounded-[10px] sm:h-[280px] md:h-[305px]">
                        <img
                            src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1200&q=80"
                            alt="Dummy pharmacy bottles on a table"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent" />
                    </div>

                    <div className="flex min-h-[230px] flex-col justify-center rounded-[10px] bg-[#eef1f9] px-6 py-7 sm:min-h-[280px] sm:px-8 md:min-h-[305px] md:px-10 lg:px-[42px]">
                        <h2 className="max-w-[520px] text-[20px] font-extrabold uppercase leading-[1.5] tracking-[-0.01em] text-[#111111] sm:text-[22px] md:text-[18px] lg:text-[20px]">
                            {content.title}
                        </h2>

                        <p className="mt-5 max-w-[490px] text-[13px] leading-[2.05] text-[#6f7482] sm:text-[14px] md:text-[13px]">
                            {content.description}
                        </p>

                        <div className="mt-7">
                            <button
                                type="button"
                                className="inline-flex h-[44px] items-center justify-center rounded-[8px] bg-[#6e9146] px-9 text-[12px] font-semibold uppercase tracking-[0.01em] text-white transition hover:bg-[#5f803c]"
                            >
                                {content.buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TwoCards;