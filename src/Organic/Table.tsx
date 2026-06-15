type Props = {
  variant: "organic" | "herbal" | "nutraceutical";
};

export default function Table({ variant }: Props) {

  const colorConfig = {
  organic: {
    badgeBg: "#718A4B",
    headingColor: "#0C4A24",
    cardBg: "#B7DDB3",
    buttonBg: "#0B4A1C",
  },

  herbal: {
    badgeBg: "#C38046",
    headingColor: "#C38046",
    cardBg: "#F9F4ED",
    buttonBg: "#C38046",
  },

  nutraceutical: {
    badgeBg: "#4AA3A7",
    headingColor: "#4AA3A7",
    cardBg: "#EDF9F9",
    buttonBg: "#4AA3A7",
  },
};

const colors = colorConfig[variant];
  const dummyImage =
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="mx-auto w-full  px-4 md:px-10">
        <div className="mb-8 md:mb-10">
          <span
  className="inline-flex h-[48px] items-center rounded-[10px] px-5 text-[18px] font-normal text-white shadow-sm"
  style={{
    backgroundColor: colors.badgeBg,
  }}
>
            Lorum Ipsum
          </span>

          <h2
  className="mt-7 text-[44px] font-normal leading-[0.96] tracking-[-0.04em] md:text-[64px] lg:text-[68px]"
  style={{
    color: colors.headingColor,
  }}
>
            Lorum Ipsum Dolor sit
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.02fr_1.02fr_1fr] md:gap-10">
       <div
  className="relative flex min-h-[550px] flex-col justify-between rounded-[14px] px-9 py-10 text-[#163925] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
  style={{
    backgroundColor: colors.cardBg,
  }}
>
            <p className="max-w-full text-[23px] font-normal leading-[1.28] p-4 tracking-[-0.02em]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
            </p>

            <div className="flex items-end justify-between gap-4 pt-10">
              <div>
                <p className="text-[26px] leading-none tracking-[-0.02em] text-[#163925]">
                  Lorum Ipsum
                </p>
                <p className="mt-2 text-[16px] leading-none text-[#7a8f71]">
                  Lorum Ipsum Lorum Ipsum
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative h-[32px] w-[32px] overflow-hidden rounded-full bg-[#f6c08b]">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-[#2d5ca8]" />
                  <div className="absolute left-[7px] top-[8px] h-[14px] w-[18px] rounded-full border-[3px] border-white border-l-0 border-t-0 rotate-[35deg]" />
                </div>
                <div className="text-[10px] font-semibold uppercase leading-[1.05] tracking-[0.08em] text-[#5a6078]">
                  <div>Christian</div>
                  <div>Counseling</div>
                  <div>Associates</div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[14px] bg-[#e6dccd] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <img
              src={dummyImage}
              alt="Modern interior"
              className="h-full min-h-[550px] w-full object-cover"
            />
          </div>

          <div className="flex min-h-[550px] flex-col gap-4">
            <div className="rounded-[14px]  px-9 py-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)]" style={{
    backgroundColor: colors.cardBg,
  }}>
              <h3 className="text-[60px] font-normal leading-[0.95] tracking-[-0.05em] text-[#0d4c25]">
                5 minutes
              </h3>
              <p className="mt-4 max-w-[290px] text-[21px] font-normal leading-[1.36] tracking-[-0.02em] text-[#183828]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="rounded-[14px]  px-9 py-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)]" style={{
    backgroundColor: colors.cardBg,
  }}>
              <h3 className="text-[60px] font-normal leading-[0.95] tracking-[-0.05em] text-[#0d4c25]">
                50%
              </h3>
              <p className="mt-4 max-w-[290px] text-[21px] font-normal leading-[1.36] tracking-[-0.02em] text-[#183828]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

           <button
  type="button"
  className="mt-auto flex h-[120px] items-center justify-between rounded-[14px] px-9 text-left text-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-transform duration-200 hover:translate-y-[4px]"
  style={{
    backgroundColor: colors.buttonBg,
  }}
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
                aria-hidden="true"
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