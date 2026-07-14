import { H1, P } from "../Global/Typography/Typo";
import { landingConfigs }  from "./data/landingconfig";
import type { LandingVariant } from "./data/landingconfig";

type Props = {
  variant: LandingVariant;
};

export default function OrganicLanding({ variant }: Props) {
  const config = landingConfigs[variant];

  return (
    <section className="w-full  bg-white py-4 sm:py-6 mt-8 xl:mt-14">
      <div className="mx-auto   w-full px-4 sm:px-6">
        <div
          className="relative absolute    overflow-hidden rounded-[22px] shadow-[0_8px_28px_rgba(121,145,66,0.08)]"
          style={{
            backgroundColor: config.colors.sectionBg,
          }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-right bg-no-repeat"
            style={{
              backgroundImage: `url(${config.bgImage})`,
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,251,245,0.98)_0%,rgba(248,250,239,0.96)_22%,rgba(243,247,229,0.72)_40%,rgba(243,247,229,0.18)_58%,rgba(243,247,229,0)_72%)]" />

          {/* Decorative Shape */}
          <div className="absolute right-[34.5%] top-[-28%] h-[165%] w-[18%] rotate-[17deg] rounded-[999px] border-[20px] border-white/40" />

          <div className="relative z-10 flex min-h-[310px] flex-col justify-between px-6 py-7 sm:px-8 md:px-10 lg:px-14">
            {/* Heading */}
            <div className="max-w-[48%] text-center ">
              <H1 className="
              ">
                {config.title}
              </H1>

              <P
                className="mt-3 "
                style={{
                  color: config.colors.subtitle,
                }}
              >
                {config.subtitle}
              </P>
            </div>

            {/* Features */}
            <div className="mt-6 grid  justify-between  items-center max-w-[45%] grid-cols-2 sm:grid-cols-4 gap-5">
              {config.features.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="flex h-[42px] w-[42px] items-center justify-center rounded-full border"
                    style={{
                      borderColor: config.colors.iconBorder,
                    }}
                  >
                    <img
                      src={config.icon}
                      alt=""
                      className="h-5 w-5 object-contain"
                    />
                  </div>

                  <P className="mt-3">
                    {item}
                  </P>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}