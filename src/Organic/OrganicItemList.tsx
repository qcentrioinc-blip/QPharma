export default function OrganicItemList() {
  const dummyProductImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 230'>
      <rect width='320' height='230' fill='#fbfbf9'/>
      <rect x='28' y='182' width='264' height='4' rx='2' fill='#d9d9d6'/>
      <ellipse cx='74' cy='173' rx='18' ry='8' fill='#ffc928'/>
      <ellipse cx='94' cy='172' rx='11' ry='5' fill='#ffb700'/>
      <rect x='128' y='28' width='62' height='134' rx='8' fill='#f4a800'/>
      <rect x='128' y='17' width='62' height='18' rx='4' fill='#f4f4f1'/>
      <rect x='137' y='42' width='44' height='110' rx='2' fill='#ff7f00' opacity='0.38'/>
      <g fill='#ef8f00' opacity='0.95'>
        <ellipse cx='154' cy='56' rx='15' ry='8' transform='rotate(-22 154 56)'/>
        <ellipse cx='162' cy='73' rx='15' ry='8' transform='rotate(-24 162 73)'/>
        <ellipse cx='154' cy='90' rx='15' ry='8' transform='rotate(-20 154 90)'/>
        <ellipse cx='164' cy='107' rx='15' ry='8' transform='rotate(-26 164 107)'/>
        <ellipse cx='154' cy='124' rx='15' ry='8' transform='rotate(-18 154 124)'/>
        <ellipse cx='163' cy='141' rx='15' ry='8' transform='rotate(-24 163 141)'/>
      </g>
      <rect x='24' y='20' width='272' height='160' rx='8' fill='url(#fade)' opacity='0.22'/>
      <defs>
        <linearGradient id='fade' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='#ffffff'/>
          <stop offset='1' stop-color='#ecece8'/>
        </linearGradient>
      </defs>
    </svg>
  `)}`;

  const items = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    title: "Lorum Ipsum",
    description: "Lorum Ipsum Lorum ipsum Lorum Ipsum Lorum.",
    badge: "Organic",
    bulk: "Bulk Pack",
    moq: "MOQ: 10000 units",
    extra: "Lorum Ipsum",
    image: dummyProductImage,
  }));

  const ProductCard = ({ item }) => (
    <article className="relative overflow-hidden rounded-[14px] border border-[#9f9f9f] bg-white px-[10px] pb-[10px] pt-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <button
        type="button"
        aria-label="Wishlist"
        className="absolute right-[12px] top-[12px] z-10 flex h-[20px] w-[20px] items-center justify-center text-black"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21s-7-4.6-7-10.4A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7 3.3C19 16.4 12 21 12 21Z" />
        </svg>
      </button>

      <div className="flex h-[132px] items-center justify-center overflow-hidden rounded-[4px] bg-[#f8f8f5]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="pt-[8px]">
        <span className="inline-flex h-[18px] items-center rounded-[4px] bg-[#6fb139] px-[10px] text-[10px] font-medium leading-none text-white">
          {item.badge}
        </span>

        <h3 className="mt-[8px] text-[18px] font-normal leading-[1.08] tracking-[-0.03em] text-[#242424]">
          {item.title}
        </h3>

        <p className="mt-[4px] max-w-[165px] text-[12px] leading-[1.22] text-[#3e3e3e]">
          {item.description}
        </p>

        <div className="mt-[8px]">
          <p className="text-[12px] font-semibold leading-none text-[#191919]">
            {item.bulk}
          </p>

          <div className="mt-[4px] flex items-center justify-between gap-3 text-[10px] leading-none text-[#8b8b8b]">
            <span>{item.moq}</span>
            <span>{item.extra}</span>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <section className="w-full bg-white py-6 md:py-8">
      <div className="mx-auto w-full max-w-[1210px] px-4 md:px-6">
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-[42px] lg:gap-y-[46px]">
          {items.slice(0, 4).map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}

          <aside className="rounded-[20px] bg-[#edf8e8] px-[18px] pb-[18px] pt-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="text-[24px] font-semibold leading-none tracking-[-0.03em] text-black">
              For Enquiries
            </h2>

            <div className="mt-[10px] space-y-[6px] text-[15px] leading-[1.18] text-[#303030]">
              <p>Lorum Ipsum Lorum ipsum</p>
              <p>Lorum Ipsum Lorum.</p>
            </div>

            <ul className="mt-[10px] space-y-[8px]">
              {["Lorum Ipsum Lorum.", "Lorum Ipsum Lorum."].map((text, idx) => (
                <li key={idx} className="flex items-center gap-[9px] text-[14px] text-[#3b3b3b]">
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#2d2d2d] text-[#2d2d2d]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[10px] w-[10px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
                      <path d="M12 5.2a6.8 6.8 0 1 0 0 13.6" />
                    </svg>
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-[16px] space-y-[10px]">
              <button
                type="button"
                className="flex h-[42px] w-full items-center justify-center rounded-[10px] bg-[#6fad33] text-[16px] font-semibold text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)]"
              >
                Connect Us
              </button>

              <button
                type="button"
                className="flex h-[42px] w-full items-center justify-center rounded-[10px] border border-[#9bc26a] bg-transparent text-[16px] font-semibold text-[#75aa3d]"
              >
                Download Catalog
              </button>
            </div>
          </aside>

          <button
            type="button"
            aria-label="Next items"
            className="absolute right-[280px] top-[148px] z-20 hidden h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-[#e7e7e7] text-black shadow-[0_2px_6px_rgba(0,0,0,0.12)] lg:flex"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[20px] w-[20px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {items.slice(4).map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}