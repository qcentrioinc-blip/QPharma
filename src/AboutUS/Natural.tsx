import React from "react";

type NaturalItem = {
    title: string;
    subtitle: string;
};

const items: NaturalItem[] = [
    { title: "100 % Natural", subtitle: "Pure ingredients" },
    { title: "100 % Natural", subtitle: "Pure ingredients" },
    { title: "100 % Natural", subtitle: "Pure ingredients" },
    { title: "100 % Natural", subtitle: "Pure ingredients" },
];

const LeafIcon: React.FC = () => {
    return (
        <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#d8d8d1] bg-[#fafaf5]">
            <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M14.808 14.675C14.808 10.404 17.413 6.624 21.38 5.117C21.976 9.567 20.535 14.207 16.983 16.803C16.327 17.282 15.594 17.639 14.808 17.868V14.675Z"
                    stroke="#6E8D52"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12.247 16.128C12.247 12.703 10.156 9.672 6.972 8.463C6.493 12.032 7.649 15.754 10.5 17.836C11.026 18.22 11.613 18.506 12.247 18.688V16.128Z"
                    stroke="#6E8D52"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M13.454 13.862V22.335"
                    stroke="#6E8D52"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

const Natural: React.FC = () => {
    return (
        <section className="w-full bg-[#fafaf5] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-2 md:grid-cols-4 md:gap-x-6 lg:gap-x-10">
                    {items.map((item, index) => (
                        <article key={index} className="flex items-center gap-3 sm:gap-4">
                            <LeafIcon />

                            <div className="min-w-0">
                                <h3 className="text-[12px] font-extrabold leading-none text-[#6a8849] sm:text-[13px]">
                                    {item.title}
                                </h3>
                                <p className="mt-[8px] text-[12px] leading-none text-[#1b1b1b] sm:text-[13px]">
                                    {item.subtitle}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Natural;