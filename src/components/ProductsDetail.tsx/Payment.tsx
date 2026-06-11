const Payment = () => {
  const orderItems = [
    {
      id: 1,
      name: "Lorum Ipsum Lorum Ipsum",
      qty: 4,
      price: "$ 200.79",
    },
    {
      id: 2,
      name: "Lorum Ipsum Lorum Ipsum",
      qty: 2,
      price: "$ 100.00",
    },
    {
      id: 3,
      name: "Lorum Ipsum Lorum Ipsum",
      qty: 1,
      price: "$ 33.000",
    },
    {
      id: 4,
      name: "Lorum Ipsum Lorum Ipsum",
      qty: 1,
      price: "$ 33.000",
    },
  ];

  return (
    <section className="w-full min-h-screen bg-[#f4f4f4] px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* LEFT SIDE */}
          <div>
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
              Payment Options
            </h2>

            {/* Payment Methods */}
            <div className="space-y-5">
              {/* Apple Pay */}
              <button className="w-full bg-white border border-gray-300 rounded-2xl py-5 flex items-center justify-center transition-all duration-300 hover:shadow-md hover:border-gray-400">
                <span className="text-3xl font-semibold flex items-center gap-2">
                   Pay
                </span>
              </button>

              {/* Google Pay */}
              <button className="w-full bg-white border border-gray-300 rounded-2xl py-5 flex items-center justify-center transition-all duration-300 hover:shadow-md hover:border-gray-400">
                <span className="text-3xl font-semibold flex items-center gap-2">
                   Pay
                </span>
              </button>

              {/* Card Payment */}
              <div className="bg-[#efefe9] rounded-2xl p-5 flex items-start gap-4 border border-transparent hover:border-gray-300 transition-all duration-300">
                {/* Left Icon */}
                <div className="min-w-[60px]">
                  <div className="text-2xl font-bold italic">VISA</div>

                  <div className="flex items-center gap-1 mt-3">
                    <div className="w-8 h-8 rounded-full bg-black opacity-90"></div>
                    <div className="w-8 h-8 rounded-full bg-black -ml-3 opacity-70"></div>
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-black">
                    Pay by card
                  </h3>

                  <p className="text-gray-700 mt-1 leading-snug text-sm md:text-base">
                    Pay by card To pay, please enter your VISA, MasterCard or
                    Maestro payment card information.
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-black text-xl">⌄</div>
              </div>

              {/* Net Banking */}
              <div className="bg-[#efefe9] rounded-2xl p-5 flex items-start gap-4 border border-transparent hover:border-gray-300 transition-all duration-300">
                {/* Bank Icon */}
                <div className="min-w-[60px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="w-14 h-14 text-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10.5 12 4l9 6.5M4.5 10.5h15M6 10.5V18m4-7.5V18m4-7.5V18m4-7.5V18M3 20h18"
                    />
                  </svg>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-2xl font-semibold text-black">
                    Net Banking
                  </h3>

                  <p className="text-gray-700 mt-1 leading-snug text-sm md:text-base">
                    Pay by card To pay, please enter your VISA, MasterCard or
                    Maestro payment card information.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-4 mt-10">
              {/* Lock Icon */}
              <div className="mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-8 h-8 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V7.875a4.5 4.5 0 1 0-9 0V10.5m-1.5 0h12a1.5 1.5 0 0 1 1.5 1.5v7.5A1.5 1.5 0 0 1 18 21H6a1.5 1.5 0 0 1-1.5-1.5V12A1.5 1.5 0 0 1 6 10.5Z"
                  />
                </svg>
              </div>

              <p className="text-sm md:text-base text-black leading-relaxed font-medium">
                Your payment is 100% safe and secure. We use encryption to
                protect your data and only work with verified payment gateways.
                Your trust is a priority for us.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col">
            {/* Price */}
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl text-black">
                Total Price
              </h3>

              <h2 className="text-4xl md:text-5xl font-bold mt-2">
                $ 333.79
              </h2>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#e9e9eb] rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  {/* Product */}
                  <div>
                    <h4 className="text-gray-700 text-sm md:text-base leading-snug">
                      {item.name}
                    </h4>

                    <p className="text-gray-600 text-sm">Lorum Ipsum</p>
                  </div>

                  {/* Qty */}
                  <div className="text-gray-600 text-sm md:text-base">
                    {item.qty}
                  </div>

                  {/* Price */}
                  <div className="text-lg md:text-2xl text-gray-700 font-medium whitespace-nowrap">
                    {item.price}
                  </div>
                </div>
              ))}
            </div>

            {/* Pay Button */}
            <button className="w-full bg-[#5a843d] hover:bg-[#4f7636] text-white text-xl md:text-2xl font-semibold py-4 rounded-lg mt-10 transition-all duration-300 shadow-sm hover:shadow-lg">
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;