import React from "react";
import {
  ShieldCheck,
  Truck,
  BadgeDollarSign,
  type LucideIcon,
} from "lucide-react";

type FeatureCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const cards: FeatureCard[] = [
  {
    title: "100% AUTHENTIC\nPRODUCTS",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: ShieldCheck,
  },
  {
    title: "FAST\nDELIVERY",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: Truck,
  },
  {
    title: "AFFORDABLE\nPRICE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: BadgeDollarSign,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="w-full bg-[#f4f4f4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="group flex min-h-[220px] flex-col rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <h3 className="whitespace-pre-line text-lg font-extrabold uppercase leading-tight tracking-tight text-[#111111] lg:text-xl">
                    {card.title}
                  </h3>

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors duration-300 group-hover:bg-gray-200">
                    <Icon
                      size={24}
                      className="text-gray-700"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                <p className="mt-8 text-sm leading-7 text-gray-600 lg:text-base">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;