export default function Ingredient() {
  const dummyImage =
    "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80";

  const items = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: "Immunity Boosters",
    description:
      "Powerful nutrients and antioxidants to strengthen immunity and fight illness.",
    points: [
      "Lorem ipsum dolor sit ame",
      "Lorem ipsum dolor sit ame",
      "Lorem ipsum dolor sit ame",
      "Lorem ipsum dolor sit ame",
    ],
    image: dummyImage,
  }));

  return (
    <section className="w-full bg-white py-4 md:py-6">
      <div className="mx-auto w-full max-w-[1140px] px-4 md:px-6">
        <h2 className="mb-6 text-[34px] font-normal leading-none tracking-[-0.03em] text-black md:mb-8 md:text-[44px] lg:text-[58px]">
          Ingredients we use
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[2px] border border-[#e8e5de] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              <div className="relative h-[160px] w-full overflow-hidden bg-[#f4f4f1]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-[0_1px_4px_rgba(0,0,0,0.16)]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px] text-[#99a0ad]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20.5s-7-4.35-7-10.25A4.25 4.25 0 0 1 12 7.1a4.25 4.25 0 0 1 7 3.15c0 5.9-7 10.25-7 10.25Z" />
                  </svg>
                </button>
              </div>

              <div className="px-3 pb-4 pt-3">
                <h3 className="text-[22px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#6f8556]">
                  {item.title}
                </h3>

                <p className="mt-2 text-[12px] leading-[1.45] text-[#2f2f2f]">
                  {item.description}
                </p>

                <div className="mt-3 h-px w-full bg-[#e4e1db]" />

                <ul className="mt-3 space-y-[10px]">
                  {item.points.map((point, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-[#8a9a6c] text-[#8a9a6c]">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-[11px] w-[11px]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                          <path d="M8 8c1.4 1 2.7 1.6 4 1.6S14.6 9 16 8" />
                        </svg>
                      </span>

                      <span className="text-[12px] leading-none text-[#4b4b4b]">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}