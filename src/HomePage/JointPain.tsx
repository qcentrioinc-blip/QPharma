const JointPain = () => {
  return (
    <section className="w-full   py-10">
      <div className="container max-w-7xl mx-auto ">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Images */}
       <div className="flex flex-nowrap justify-center gap-2 md:gap-6 overflow-x-auto">
  <div className="w-24 h-40 md:w-40 md:h-72 overflow-hidden rounded-[80px] shadow-lg flex-shrink-0">
    <img
      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
      alt="Joint Pain"
      className="w-full h-full object-cover"
    />
  </div>

  <div className="w-24 h-40 md:w-40 md:h-72 overflow-hidden rounded-[80px] shadow-lg flex-shrink-0">
    <img
      src="https://images.unsplash.com/photo-1512069772995-ec65ed45afd6"
      alt="Medicinal Herbs"
      className="w-full h-full object-cover"
    />
  </div>

  <div className="w-24 h-40 md:w-40 md:h-72 overflow-hidden rounded-[80px] shadow-lg flex-shrink-0">
    <img
      src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae"
      alt="Medicine Dropper"
      className="w-full h-full object-cover"
    />
  </div>
</div>

          {/* Content */}
          <div className=" max-w-sm  px-4  lg:px-0 lg:max-w-2xl   text-left">
            <div className="w-full xl:w-[50%] h-1 bg-lime-500 mx-auto lg:mx-0 mb-4"></div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Lorem Ipsum Dolor
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JointPain;