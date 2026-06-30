import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Payment = () => {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  const handlePayNow = () => {
    // Generate a unique order ID
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    const orderId = `QP-${randomNum}`;

    // Redirect to Checkout Form page with the orderId
    navigate(`/checkout/${orderId}`);
  };

  const orderItems = items.length > 0 ? items : [
    {
      id: 1,
      title: "Lorum Ipsum Lorum Ipsum",
      quantity: 4,
      price: "₹ 200.79",
    },
    {
      id: 2,
      title: "Lorum Ipsum Lorum Ipsum",
      quantity: 2,
      price: "₹ 100.00",
    }
  ];

  const total = items.length > 0 ? (totalPrice + 40).toFixed(2) : "333.79";

  return (
    <section className="w-full min-h-screen bg-[#f8f9fa] px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-1 bg-[#5A843D] rounded-full"></div>
          <h2 className="text-3xl font-bold text-[#1a1a1a]">Secure Checkout</h2>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT SIDE: Payment Options (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eee]">
              <h3 className="text-xl font-bold text-[#333] mb-8">Select Payment Method</h3>

              <div className="space-y-4">
                {/* UPI / GPay / PhonePe */}
                <div
                  onClick={() => setSelectedMethod("upi")}
                  className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 ${selectedMethod === "upi" ? "border-[#5A843D] bg-[#f0f7eb]" : "border-[#eee] hover:border-[#ddd] bg-white"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === "upi" ? "border-[#5A843D]" : "border-[#ccc]"}`}>
                        {selectedMethod === "upi" && <div className="w-3 h-3 rounded-full bg-[#5A843D]"></div>}
                      </div>
                      <div>
                        <p className="font-bold text-[#1a1a1a]">UPI / Wallets</p>
                        <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <img src="https://img.icons8.com/color/48/google-pay.png" className="h-6" alt="gpay" />
                      <img src="https://img.icons8.com/color/48/paytm.png" className="h-6" alt="paytm" />
                    </div>
                  </div>
                </div>

                {/* Card Payment */}
                <div
                  onClick={() => setSelectedMethod("card")}
                  className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 ${selectedMethod === "card" ? "border-[#5A843D] bg-[#f0f7eb]" : "border-[#eee] hover:border-[#ddd] bg-white"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === "card" ? "border-[#5A843D]" : "border-[#ccc]"}`}>
                        {selectedMethod === "card" && <div className="w-3 h-3 rounded-full bg-[#5A843D]"></div>}
                      </div>
                      <div>
                        <p className="font-bold text-[#1a1a1a]">Credit / Debit Card</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, RuPay & more</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <img src="https://img.icons8.com/color/48/visa.png" className="h-6" alt="visa" />
                      <img src="https://img.icons8.com/color/48/mastercard.png" className="h-6" alt="mastercard" />
                    </div>
                  </div>
                </div>

                {/* Net Banking */}
                <div
                  onClick={() => setSelectedMethod("netbanking")}
                  className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 ${selectedMethod === "netbanking" ? "border-[#5A843D] bg-[#f0f7eb]" : "border-[#eee] hover:border-[#ddd] bg-white"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === "netbanking" ? "border-[#5A843D]" : "border-[#ccc]"}`}>
                      {selectedMethod === "netbanking" && <div className="w-3 h-3 rounded-full bg-[#5A843D]"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a1a]">Net Banking</p>
                      <p className="text-sm text-gray-500">All major Indian banks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-[#eef2f7] rounded-2xl p-6 flex items-start gap-4 border border-[#dce4ee]">
              <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#2d5a27]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V7.875a4.5 4.5 0 1 0-9 0V10.5m-1.5 0h12a1.5 1.5 0 0 1 1.5 1.5v7.5A1.5 1.5 0 0 1 18 21H6a1.5 1.5 0 0 1-1.5-1.5V12A1.5 1.5 0 0 1 6 10.5Z"
                  />
                </svg>
              </div>
              <p className="text-sm text-[#455a64] leading-relaxed">
                <span className="font-bold text-[#1a1a1a]">Safe & Secure Payments.</span> Your data is encrypted and transactions are processed through highly secure payment gateways. We don't store your card details.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#eee] sticky top-24">
              <h3 className="text-xl font-bold text-[#333] mb-6">Payment Summary</h3>

              <div className="space-y-4 mb-8">
                {orderItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#fafafa] border border-[#f0f0f0]"
                  >
                    <div className="flex-1">
                      <h4 className="text-[#1a1a1a] text-sm font-semibold truncate max-w-[200px]">
                        {item.title || item.name}
                      </h4>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity || item.qty}</p>
                    </div>
                    <div className="text-sm font-bold text-[#5A843D]">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-[#f0f0f0]">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span>₹{totalPrice > 0 ? totalPrice.toFixed(2) : "293.79"}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Shipping Fee</span>
                  <span className="text-[#5A843D]">₹40.00</span>
                </div>
                <div className="flex justify-between items-center pt-4 text-2xl font-bold text-[#1a1a1a]">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePayNow}
                className="w-full bg-[#5a843d] hover:bg-[#4a6d32] text-white text-lg font-bold py-4 rounded-2xl mt-10 transition-all duration-300 shadow-[0_8px_20px_rgba(90,132,61,0.25)] hover:shadow-[0_12px_24px_rgba(90,132,61,0.35)] flex items-center justify-center gap-3"
              >
                Proceed to Details
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>

              <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-40">
                <img src="https://img.icons8.com/color/48/visa.png" className="h-5" alt="visa" />
                <img src="https://img.icons8.com/color/48/mastercard.png" className="h-5" alt="master" />
                <img src="https://img.icons8.com/color/48/google-pay-india.png" className="h-5" alt="gpay" />
                <img src="https://img.icons8.com/color/48/paytm.png" className="h-5" alt="paytm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;