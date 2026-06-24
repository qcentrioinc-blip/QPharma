

import heroImg from "/Production/ProductionsHeroRight.png";
import labImg from "/Production/ProductionsHeroLeft.png";

const HeroSection = () => {
  return (
   <section className="relative w-full overflow-hidden">
  <div className="mx-auto max-w-7xl py-12   md:py-20  lg:py-10 xl:py-24">

    {/* Heading */}
    <div className="max-w-full">
      <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-light text-gray-800 leading-tight">
        Lorum Ipsum
      </h1>

      <p className="mt-6  lg:mb-4 xl:mb-0 text-base md:text-lg leading-8  max-w-full  lg:max-w-2xl xl:max-w-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Faucibus in libero risus semper habitant arcu eget.
        Et integer facilisi eget.
      </p>
    </div>

    {/* Layout Area */}
    <div className="relative mt-10 xl:mt-0 xl:h-[750px]">

      {/* RIGHT IMAGE */}
      <div className="absolute xl:right-0 xl:top-[-180px]">
        <img
          src={heroImg}
          alt=""
          className="
            w-full
            xl:w-[500px]
            xl:w-[560px]
            2xl:w-[620px]
            h-auto
            object-cover
          "
        />
      </div>

      {/* LEFT IMAGE */}
      <div className="mt-10 xl:absolute xl:left-0 xl:top-[120px]">
        <img
          src={labImg}
          alt=""
          className="
            w-full
            xl:w-[430px]
            xl:w-[500px]
            2xl:w-[560px]
            h-auto
            object-cover
          "
        />
      </div>

      {/* GLASS CARD */}
      <div
      style={{
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(153,149,149,0.9) 100%)",
  backdropFilter: "blur(24px)",
}}
        className="
          mt-6
          xl:absolute
          xl:left-[220px]
          xl:left-[450px]
          lg:bottom-0
          w-full
          lg:w-[700px]
          xl:w-[850px]
          md:rounded-full
          backdrop-blur-xl
          bg-[#999595]
          border border-white/40
          shadow-2xl
          p-6 md:p-10
        "
      >
        <div className="grid grid-cols-1 py-4 px-10 sm:grid-cols-3 gap-10">

          <div>
            <h3 className="text-3xl font-semibold">5.8</h3>
            <div className="w-10 h-[3px] bg-gray-800 my-4" />
            <p className="text-sm md:text-base text-gray-700 leading-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-semibold">99+</h3>
            <div className="w-10 h-[3px] bg-gray-800 my-4" />
            <p className="text-sm md:text-base text-gray-700 leading-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-semibold">110K</h3>
            <div className="w-10 h-[3px] bg-gray-800 my-4" />
            <p className="text-sm md:text-base text-gray-700 leading-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>
  );
};

export default HeroSection;