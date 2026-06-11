export default function TwoCard() {
  const dummyImage =
    "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80";

  const cards = [
    {
      id: 1,
      title: "Lorem ipsum:",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      cta: "Explore Nuetraciticals",
      ctaColor: "#4CA6B3",
    },
    {
      id: 2,
      title: "Lorem ipsum:",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      cta: "Explore Herbal",
      ctaColor: "#C98A6B",
    },
  ];

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          {cards.map((card) => (
            <article
              key={card.id}
              className="relative flex min-h-[194px] overflow-hidden rounded-[20px] border border-[#b9b9b9] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
            >
              <div className="flex w-full flex-col justify-between px-7 py-7 pr-[210px] md:pr-[225px]">
                <p className="max-w-[560px] text-[18px] leading-[1.55] tracking-[-0.02em] text-[#222222] md:text-[20px]">
                  <span className="font-semibold">{card.title}</span>{" "}
                  <span className="font-normal">{card.description}</span>
                </p>

                <button
                  type="button"
                  className="mt-6 inline-flex w-fit items-center gap-2 text-[24px] font-semibold tracking-[-0.03em] transition-opacity duration-200 hover:opacity-80 md:text-[25px]"
                  style={{ color: card.ctaColor }}
                >
                  <span>{card.cta}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h13" />
                    <path d="M13 7l5 5-5 5" />
                  </svg>
                </button>
              </div>

              <div
                className="absolute right-4 top-1/2 h-[138px] w-[190px] -translate-y-1/2 overflow-hidden rounded-[14px]"
                style={{
                  clipPath:
                    "polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%, 18% 56%)",
                }}
              >
                <img
                  src={dummyImage}
                  alt="Scientific healthcare visual"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(125,205,244,0.15)_0%,rgba(255,255,255,0)_55%,rgba(84,183,227,0.12)_100%)]" />

                <div
                  className="absolute bottom-0 left-0 h-[54%] w-full"
                  style={{
                    background:
                      "repeating-radial-gradient(120% 100% at 0% 100%, rgba(96,194,237,0.32) 0 2px, transparent 2px 14px)",
                    opacity: 0.8,
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}