const JointPain = () => {
  return (
    <section className="w-full py-10 px-4 md:px-8 lg:px-12">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:gap-12 xl:gap-16">

          {/* Images */}
          <div className="flex flex-nowrap justify-center gap-4 md:gap-6 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto scrollbar-hide">
            <div className="w-28 h-44 sm:w-32 sm:h-52 md:w-40 md:h-72 overflow-hidden rounded-[80px] shadow-lg flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
                alt="Joint Pain"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-28 h-44 sm:w-32 sm:h-52 md:w-40 md:h-72 overflow-hidden rounded-[80px] shadow-lg flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1512069772995-ec65ed45afd6"
                alt="Medicinal Herbs"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-28 h-44 sm:w-32 sm:h-52 md:w-40 md:h-72 overflow-hidden rounded-[80px] shadow-lg flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae"
                alt="Medicine Dropper"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="max-w-md lg:max-w-lg text-center lg:text-left px-4 lg:px-0">
            <div className="w-[100px] lg:w-[150px] xl:w-[200px] h-1 bg-lime-500 mx-auto lg:mx-0 mb-4"></div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Lorem Ipsum Dolor
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm md:text-base lg:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JointPain;