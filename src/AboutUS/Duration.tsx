import React from "react";

type TimelineItem = {
    year: string;
    text: string;
};

const leftItems: TimelineItem[] = [
    { year: "1997", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit," },
    { year: "1998", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit," },
    { year: "2000", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit," },
    { year: "2002", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit," },
    { year: "2004", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit," },
    {
        year: "2005",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    },
    {
        year: "2006",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,Lorem ipsum dolor sit amet, consectetur adipiscing elit,Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    },
    { year: "2010", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit," },
    { year: "2013", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit," },
];

const rightItems: TimelineItem[] = [
    {
        year: "2014",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    },
    {
        year: "2016",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    },
    { year: "2020", text: "Lorem Ipsum comes from sections 1.10.32" },
    { year: "2021", text: "Making this the first true generator on the Internet" },
    {
        year: "2022",
        text: "Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour",
    },
    {
        year: "2023",
        text: "here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form",
    },
];

const Duration: React.FC = () => {
    return (
        <section className="w-full bg-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl bg-white pb-2">
                <h2 className="text-[18px] font-extrabold uppercase leading-[1.25] tracking-[-0.02em] text-[#111111] sm:text-[20px] md:text-[19px]">
                    FROM A RETAIL STORE TO THE GLOBAL CHAIN OF STORES
                </h2>

                <p className="mt-[28px] max-w-[780px] text-[13px] leading-[1.9] text-[#1e1e1e] sm:text-[14px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <div className="mt-[28px] grid grid-cols-1 gap-y-3 md:grid-cols-2 md:gap-x-[84px] lg:gap-x-[120px]">
                    <div className="space-y-[6px]">
                        {leftItems.map((item) => (
                            <div key={item.year} className="text-[13px] leading-[1.85] text-[#6c6c6c] sm:text-[14px]">
                                <span className="mr-[8px] inline-block font-extrabold text-[#111111]">{item.year}:</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-[6px]">
                        {rightItems.map((item) => (
                            <div key={item.year} className="text-[13px] leading-[1.85] text-[#6c6c6c] sm:text-[14px]">
                                <span className="mr-[8px] inline-block font-extrabold text-[#111111]">{item.year}:</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-[32px] h-px w-full bg-[#ececec]" />
            </div>
        </section>
    );
};

export default Duration;