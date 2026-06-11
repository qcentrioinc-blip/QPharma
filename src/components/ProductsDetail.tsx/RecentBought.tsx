const RecentBought = () => {
  const products = [
    {
      id: 1,
      name: "Auraflow Capsules",
      price: "$569.00",
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Organic Herbal Mix",
      price: "$369.00",
      image:
        "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Daily Vitamins",
      price: "$129.00",
      image:
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-5 md:p-8">
      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Frequently Bought Together
          </h2>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Customers also purchased these products
          </p>
        </div>

        <span className="hidden md:flex bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
          Bundle & Save
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Products */}
        <div className="xl:col-span-2">
          {/* Product Cards */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
            {products.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 w-full lg:w-auto"
              >
                {/* Card */}
                <div className="relative group bg-gray-50 hover:bg-white border border-gray-200 hover:border-green-400 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl w-full sm:w-[250px]">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    defaultChecked
                    className="absolute top-4 left-4 w-5 h-5 accent-green-600 cursor-pointer"
                  />

                  {/* Image */}
                  <div className="flex justify-center mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-xl"
                    />
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {item.name}
                    </h3>

                    <p className="text-green-600 font-bold text-xl mt-2">
                      {item.price}
                    </p>
                  </div>
                </div>

                {/* Plus Icon */}
                {index !== products.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-2xl font-bold text-gray-500">
                    +
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Plus Icons */}
          <div className="flex lg:hidden justify-center gap-3 mt-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold">
              +
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold">
              +
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-gray-500 uppercase tracking-wide text-sm">
              Total Price
            </p>

            <h3 className="text-4xl font-extrabold text-gray-900 mt-2">
              $609.00
            </h3>

            <div className="mt-6 space-y-3">
              {products.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 accent-green-600"
                  />

                  <div>
                    <p className="text-gray-700 text-sm">{item.name}</p>
                    <span className="text-green-600 font-semibold text-sm">
                      {item.price}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8">
            <button className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white font-semibold py-4 rounded-2xl shadow-md hover:shadow-xl">
              Add All To Cart
            </button>

            <button className="w-full mt-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-4 rounded-2xl transition-all duration-300">
              Add To Wishlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentBought;