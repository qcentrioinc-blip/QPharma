export default function Table() {
  const dummyImage =
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="w-full bg-white py-8 md:py-12">
  <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-10">
        <div className="mb-8 md:mb-10">
          {/* <span className="inline-flex h-[48px] items-center rounded-[10px] bg-[#718A4B] px-5 text-[18px] font-normal text-white shadow-sm">
            Lorum Ipsum
          </span> */}

          <h2 className="mt-7 text-[44px] font-normal leading-[0.96] tracking-[-0.04em] text-[#000000] md:text-[64px] lg:text-[68px]">
            Lorum Ipsum Dolor sit
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-[1.02fr_1.02fr_1fr]">
          {/* Left Card */}
          <div className="relative flex min-h-[300px] lg:min-h-[550px] flex-col justify-between rounded-[14px] bg-[#eef1f9] px-4 py-10 text-[#163925] shadow-[0_2px_10px_rgba(0,0,0,0.04)] md:px-9">
            <p className="max-w-full p-0 text-[23px] font-normal leading-[1.28] tracking-[-0.02em] md:p-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>

            <div className="flex items-end justify-between gap-4 pt-10">
              <div>
                <p className="text-[26px] leading-none tracking-[-0.02em] text-[#163925]">
                  Lorum Ipsum
                </p>
                <p className="mt-2 text-[16px] leading-none text-[#7A8F71]">
                  Lorum Ipsum Lorum Ipsum
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative h-[32px] w-[32px] overflow-hidden rounded-full bg-[#F6C08B]">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-[#2D5CA8]" />
                  <div className="absolute left-[7px] top-[8px] h-[14px] w-[18px] rotate-[35deg] rounded-full border-[3px] border-l-0 border-t-0 border-white" />
                </div>

                <div className="text-[10px] font-semibold uppercase leading-[1.05] tracking-[0.08em] text-[#5A6078]">
                  <div>Lorum Ipsum</div>
                  <div>Zephyr</div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Image */}
          <div className="overflow-hidden rounded-[14px] bg-[#E6DCCD] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <img
              src={dummyImage}
              alt="Modern interior"
              className="h-full min-h-[550px] w-full object-cover"
            />
          </div>

          {/* Right Cards */}
          <div className="flex min-h-[550px] flex-col gap-4">
            <div className="rounded-[14px] bg-[#eef1f9] px-9 py-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <h3 className="text-[60px] font-normal leading-[0.95] tracking-[-0.05em] text-[#000000]">
                5 minutes
              </h3>

              <p className="mt-4 max-w-full text-[21px] font-normal leading-[1.36] tracking-[-0.02em] text-[#080808] xl:max-w-[290px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="rounded-[14px] bg-[#eef1f9] px-9 py-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <h3 className="text-[60px] font-normal leading-[0.95] tracking-[-0.05em] text-[#000000]">
                50%
              </h3>

              <p className="mt-4 max-w-full text-[21px] font-normal leading-[1.36] tracking-[-0.02em] text-[#183828] xl:max-w-[290px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <button
              type="button"
              className="mt-auto flex h-[120px] items-center justify-between rounded-[14px] bg-[#050505] px-9 text-left text-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-transform duration-200 hover:translate-y-[4px]"
            >
              <span className="text-[21px] font-normal tracking-[-0.02em]">
                Lorum Ipsum
              </span>

              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h16" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}