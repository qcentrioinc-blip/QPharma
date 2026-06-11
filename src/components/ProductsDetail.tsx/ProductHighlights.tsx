const ProductHighlights = () => {
  const products = [
    {
      id: "01",
      title: "Lorum Ipsum",
      subtitle: "unti duos Lorum Ipsum",
      image:
        "/Global/Probiotic.png",
      bg: "bg-[#eef5ea]",
      button: "bg-[#67ad2f] hover:bg-[#5a9828]",
      number: "text-[#67ad2f]",
    },
    {
      id: "02",
      title: "Lorum Ipsum",
      subtitle: "unti duos Lorum Ipsum",
      image:
        "/Global/Probiotic.png",
      bg: "bg-[#e8f4f3]",
      button: "bg-[#3f978d] hover:bg-[#357f77]",
      number: "text-[#3f978d]",
    },
    {
      id: "03",
      title: "Lorum Ipsum",
      subtitle: "unti duos Lorum Ipsum",
      image:
        "/Global/Probiotic.png",
      bg: "bg-[#f5eddf]",
      button: "bg-[#e2a63d] hover:bg-[#cf9530]",
      number: "text-[#e2a63d]",
    },
  ];

  return (
    <section className="w-full bg-white py-14 px-4 md:px-8 lg:px-14">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-light text-black">
          Lorum Ipsum
        </h2>

        <p className="mt-4 text-gray-700 text-lg md:text-2xl font-light">
          Lorum Ipsum sed unti duos Lorum Ipsum sed unti duos
        </p>    
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 max-w-7xl mx-auto">
        {products.map((item) => (
          <div key={item.id} className="w-full">
            {/* Top Card */}
            <div
              className={`${item.bg} rounded-md px-6 pt-8 pb-5 transition-all duration-300`}
            >
              {/* Product Image */}
              <div className="flex justify-center">
                <div className="bg-white w-[170px] h-[170px] md:w-[190px] md:h-[190px] flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-400 mt-10 pt-5">
                <div className="flex items-center gap-5">
                  {/* Number */}
                  <h3
                    className={`${item.number} text-5xl md:text-6xl font-light leading-none`}
                  >
                    {item.id}
                  </h3>

                  {/* Vertical Line */}
                  <div className="w-px h-16 bg-gray-400"></div>

                  {/* Text */}
                  <div>
                    <h4 className="text-2xl md:text-3xl font-light text-black">
                      {item.title}
                    </h4>

                    <p className="text-gray-500 text-lg mt-1 font-light">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              className={`w-full ${item.button} text-white text-xl font-light py-4 rounded-md mt-3 transition-all duration-300 flex items-center justify-center gap-3`}
            >
              Show More

              {/* Search Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductHighlights;