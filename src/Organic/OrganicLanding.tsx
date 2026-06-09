export default function OrganicLanding() {
  const features = [
    "Certified Organic Ingredients",
    "Certified Organic Ingredients",
    "Certified Organic Ingredients",
    "Certified Organic Ingredients",
  ];

  return (
    <section className="w-full bg-white py-4 sm:py-6">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[22px] bg-[#f8f9ef] shadow-[0_8px_28px_rgba(121,145,66,0.08)]">
          <div
            className="absolute inset-0 bg-cover bg-right bg-no-repeat"
            style={{ backgroundImage: "url('/OrganicLanding.png')" }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,251,245,0.98)_0%,rgba(248,250,239,0.96)_22%,rgba(243,247,229,0.72)_40%,rgba(243,247,229,0.18)_58%,rgba(243,247,229,0)_72%)]" />

          <div className="absolute right-[34.5%] top-[-28%] h-[165%] w-[18%] rotate-[17deg] rounded-[999px] border-[20px] border-[#cfe19e]/55" />

          <div className="absolute inset-y-0 right-[28%] w-[28%] bg-[repeating-linear-gradient(128deg,rgba(255,255,255,0.30)_0px,rgba(255,255,255,0.30)_2px,transparent_2px,transparent_28px)] opacity-55" />

          <div
            className="absolute bottom-[-10%] left-[33%] h-[42%] w-[24%] rotate-[-10deg] opacity-60"
            style={{
              background:
                "radial-gradient(circle at 2px 2px, rgba(173,192,76,0.55) 2px, transparent 2.4px)",
              backgroundSize: "13px 13px",
              transform: "perspective(900px) rotateX(67deg) rotateZ(-10deg)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.95) 14%, rgba(0,0,0,0.95) 86%, transparent 100%)",
              maskImage:
                "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.95) 14%, rgba(0,0,0,0.95) 86%, transparent 100%)",
            }}
          />

          <div className="relative z-10 flex min-h-[310px] flex-col justify-between px-6 py-7 sm:min-h-[340px] sm:px-8 sm:py-8 md:min-h-[310px] md:px-10 md:py-7 lg:px-14 lg:py-8">
            <div className="max-w-[48%] pt-1 sm:max-w-[44%] md:max-w-[40%]">
              <h2 className="text-[28px] font-normal leading-[1.04] tracking-[-0.04em] text-black sm:text-[42px] md:text-[52px] lg:text-[64px]">
                Organic Medicines
              </h2>

              <p className="mt-3 pl-1 text-[16px] font-semibold leading-none tracking-[-0.02em] text-[#6e8455] sm:text-[22px] md:text-[28px] lg:text-[30px]">
                Pure. Natural .Effective
              </p>
            </div>

            <div className="mt-6 grid max-w-[46%] grid-cols-2 gap-x-5 gap-y-5 sm:max-w-[42%] sm:grid-cols-4 sm:gap-x-6 md:max-w-[43%] md:gap-x-7 lg:max-w-[44%] lg:gap-x-8">
              {features.map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#87996b] text-[#87996b] sm:h-[42px] sm:w-[42px]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[20px] w-[20px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18.5 5.5c-5.8.4-9.7 3.5-11.8 9.6" />
                      <path d="M8.2 18c5.1-.1 8.8-2.8 10.6-8.2" />
                      <path d="M6.7 14.9c-1.4-2.5-.9-5.6 1.4-7.7 2.8-2.6 7.1-2.4 9.8.5 2.6 2.8 2.3 7.2-.5 9.8-2.4 2.2-5.7 2.5-8.4 1" />
                    </svg>
                  </div>

                  <p className="mt-3 max-w-[120px] text-[11px] font-normal leading-[1.15] text-black sm:text-[12px] md:text-[13px]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}