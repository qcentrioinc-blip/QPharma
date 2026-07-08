import React from "react";
import { ArrowRight } from "lucide-react";

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

const ShowreelSection: React.FC = () => {
    return (
        <section className="w-full bg-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[10px]">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image Card */}
                    <div className="relative min-h-[250px] md:min-h-[400px]">
                        <img
                            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                            alt="Dummy pharmacy bottles on a table"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent" />
                    </div>

                    {/* Content Card */}
                    <div className="flex min-h-[250px] flex-col justify-center bg-[#eef1f9] px-6 py-8 sm:px-8 md:min-h-[400px] md:px-10 lg:px-12">
                        <h2 className="text-lg font-extrabold uppercase leading-relaxed text-[#111111] sm:text-xl lg:text-2xl">
                            {content.title}
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-[#6f7482] sm:text-base">
                            {content.description}
                        </p>

                        <div className="mt-6">
    <button
        type="button"
        className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black shadow-sm transition-all duration-300 hover:gap-3 hover:shadow-lg lg:text-base"
    >
        {content.buttonText}
        <ArrowRight
            size={16}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1.5"
        />
    </button>
</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowreelSection;