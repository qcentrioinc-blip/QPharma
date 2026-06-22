export default function TwoCard() {
  const dummyImage =
    "/Global/TwoCardImage.png";

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
      <div className="mx-auto w-full  px-4 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          {cards.map((card) => (
            <article
              key={card.id}
              className="relative flex min-h-[194px] overflow-hidden rounded-[20px] border border-[#b9b9b9] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
            >
              <div className="flex w-full flex-col  justify-between px-7 py-7  xl:pr-[225px]">
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
                className="absolute  xl:flex hidden right-4 top-1/2 h-[138px] w-[190px] -translate-y-1/2 overflow-hidden  "
                
              >
                <img
                  src={dummyImage}
                  alt="Scientific healthcare visual"
                  className="h-full w-full object-cover"
                />

                 
 
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}