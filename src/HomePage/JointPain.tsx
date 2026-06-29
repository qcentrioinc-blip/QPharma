const JointPain = () => {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-16 xl:gap-24">

          {/* Images */}
          <div className="w-full lg:w-auto flex justify-center">
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
              <div className="w-24 h-40 sm:w-28 sm:h-48 md:w-36 md:h-64 lg:w-40 lg:h-72 overflow-hidden rounded-[999px] shadow-lg flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
                  alt="Joint Pain Relief"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-24 h-40 sm:w-28 sm:h-48 md:w-36 md:h-64 lg:w-40 lg:h-72 overflow-hidden rounded-[999px] shadow-lg flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1512069772995-ec65ed45afd6"
                  alt="Medicinal Herbs"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-24 h-40 sm:w-28 sm:h-48 md:w-36 md:h-64 lg:w-40 lg:h-72 overflow-hidden rounded-[999px] shadow-lg flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae"
                  alt="Medicine Dropper"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full max-w-3xl text-center lg:text-left">
            <div className="w-20 md:w-28 h-[3px] bg-gray-500 mx-auto lg:mx-0 mb-5" />

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Lorem Ipsum Dolor
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JointPain;