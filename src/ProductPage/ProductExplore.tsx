// import React from "react";

const ChairIllustration = () => (
  <svg
    viewBox="0 0 320 220"
    className="h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="chairMain" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff8a1f" />
        <stop offset="100%" stopColor="#f05a0a" />
      </linearGradient>
      <linearGradient id="chairDark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d94d08" />
        <stop offset="100%" stopColor="#a83200" />
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow
          dx="0"
          dy="10"
          stdDeviation="10"
          floodColor="#0b6f6d"
          floodOpacity="0.22"
        />
      </filter>
    </defs>

    <g filter="url(#shadow)">
      <ellipse cx="160" cy="188" rx="64" ry="15" fill="#108a86" opacity="0.25" />

      <rect x="115" y="28" width="90" height="72" rx="18" fill="url(#chairMain)" />
      <rect x="121" y="36" width="78" height="26" rx="10" fill="#ff9a36" opacity="0.55" />

      <rect x="100" y="84" width="120" height="70" rx="22" fill="url(#chairMain)" />
      <rect x="109" y="94" width="102" height="46" rx="18" fill="#ff8d28" opacity="0.55" />

      <rect x="86" y="78" width="28" height="70" rx="14" fill="url(#chairMain)" />
      <rect x="206" y="78" width="28" height="70" rx="14" fill="url(#chairMain)" />

      <path
        d="M105 151C115 162 127 170 145 173H175C193 170 205 162 215 151V168C215 178 206 186 196 186H124C114 186 105 178 105 168V151Z"
        fill="url(#chairDark)"
      />

      <path d="M124 182L118 210" stroke="#7c2d00" strokeWidth="5" strokeLinecap="round" />
      <path d="M196 182L202 210" stroke="#7c2d00" strokeWidth="5" strokeLinecap="round" />
      <path d="M108 132C100 126 96 112 98 98" stroke="#b44505" strokeWidth="6" strokeLinecap="round" />
      <path d="M212 132C220 126 224 112 222 98" stroke="#b44505" strokeWidth="6" strokeLinecap="round" />
    </g>
  </svg>
);

const PhoneMockup = ({ rotate = 0, dark = false, className = "" }) => (
  <div
    className={`relative rounded-[14px] border border-white/10 shadow-[0_18px_30px_rgba(0,0,0,0.35)] ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      background: dark
        ? "linear-gradient(180deg, #0c0c0d 0%, #1a1a1d 100%)"
        : "linear-gradient(180deg, #dfff1d 0%, #fff347 100%)",
    }}
  >
    <div className="mx-auto mt-[6px] h-[5px] w-[26px] rounded-full bg-black/60" />
    <div className="px-[7px] pb-[8px] pt-[8px]">
      <div
        className={`overflow-hidden rounded-[10px] ${
          dark ? "bg-black" : "bg-[#fff56f]"
        } h-full`}
      >
        {dark ? (
          <div className="flex h-full flex-col justify-between p-[8px] text-white">
            <div>
              <div className="text-[6px] font-semibold leading-none opacity-70">
                branding.co
              </div>
              <div className="mt-[6px] text-[7px] font-medium leading-[1.1]">
                PRO
              </div>
            </div>
            <div className="space-y-[4px]">
              <div className="h-[8px] rounded-full bg-white/10" />
              <div className="h-[8px] rounded-full bg-white/10" />
              <div className="h-[26px] rounded-[8px] border border-white/20 bg-white/5" />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between p-[7px] text-black">
            <div>
              <div className="text-[6px] font-bold leading-none">Smart +</div>
              <div className="mt-[6px] h-[18px] w-[22px] rounded-[5px] bg-black" />
            </div>
            <div className="space-y-[4px]">
              <div className="h-[8px] rounded-full bg-black/80" />
              <div className="h-[8px] rounded-full bg-black/80" />
              <div className="h-[8px] rounded-full bg-black/80" />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function ProductExplore() {
  return (
    <section className="w-full bg-[#f7f6f3] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto grid max-w-[1110px] grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="relative flex min-h-[220px] overflow-hidden rounded-[18px] bg-[#10a8a5] px-6 py-5 sm:px-10 sm:py-6">
          <div className="relative z-10 flex max-w-[245px] flex-col justify-center">
            <p className="max-w-[210px] text-[18px] font-medium uppercase leading-[1.12] tracking-[0.02em] text-white sm:text-[20px]">
              LORUM IPSUM LORUM IPSUM
            </p>

            <p className="mt-3 text-[15px] leading-[1.45] text-white/90">
              Fuka Relax Full Body Massage Chair
            </p>

            <button className="mt-7 inline-flex h-[38px] w-fit items-center justify-center rounded-full bg-white px-7 text-[13px] font-semibold text-[#1b1b1b] shadow-[0_8px_18px_rgba(255,255,255,0.18)] transition duration-200 hover:scale-[1.02]">
              Shop Now
            </button>
          </div>

          <div className="absolute bottom-0 right-[10px] top-[12px] w-[220px] sm:right-[24px] sm:w-[245px]">
            <ChairIllustration />
          </div>
        </article>

        <article className="relative min-h-[220px] overflow-hidden rounded-[18px] bg-[linear-gradient(90deg,#27282c_0%,#26272b_48%,#34363c_100%)] px-6 py-5 sm:px-8 sm:py-6">
          <div className="relative z-10 flex h-full max-w-[340px] flex-col">
            <div className="grid grid-cols-[120px_1fr] gap-4 sm:grid-cols-[126px_1fr] sm:gap-5">
              <h2 className="text-[21px] font-medium leading-[1.12] text-white sm:text-[22px]">
                Download our app
              </h2>

              <p className="max-w-[170px] pt-[2px] text-[13px] leading-[1.45] text-white/70">
                Enter your phone number and we'll send you a download link.
              </p>
            </div>

            <div className="mt-7 flex h-[34px] w-full max-w-[265px] items-center overflow-hidden rounded-[6px] bg-[#2f3136]">
              <input
                type="text"
                placeholder="(+xx) xx..."
                className="h-full flex-1 bg-transparent px-4 text-[13px] text-white outline-none placeholder:text-[#8d8f95]"
              />
              <button className="h-full whitespace-nowrap px-4 text-[12px] font-medium text-[#34d058] transition hover:text-[#2dc14e]">
                SEND LINK
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 h-full w-[250px]">
            <div className="absolute bottom-0 right-[6px] h-[120px] w-[168px] bg-[linear-gradient(180deg,#c6c7cd_0%,#989aa1_100%)] [clip-path:polygon(12%_15%,88%_0,100%_100%,0_100%)] opacity-95" />
            <div className="absolute bottom-[60px] right-[112px]">
              <PhoneMockup
                rotate={-7}
                className="h-[106px] w-[50px]"
              />
            </div>
            <div className="absolute bottom-[6px] right-[34px]">
              <PhoneMockup
                rotate={-2}
                dark
                className="h-[110px] w-[54px]"
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}