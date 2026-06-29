import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../Global/Navbar";
import Footer from "../Global/Footer";

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
);

const titleFont = { fontFamily: '"Cormorant Garamond", Georgia, serif' };

export default function CheckoutPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const { items, totalPrice, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
        pincode: ""
    });

    const [paymentData, setPaymentData] = useState({
        cardNumber: "",
        expiry: "",
        cvv: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;

        if (name === "cardNumber") {
            value = value.replace(/\D/g, "").substring(0, 16);
            value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        } else if (name === "expiry") {
            value = value.replace(/\D/g, "").substring(0, 4);
            if (value.length >= 2) {
                value = value.substring(0, 2) + "/" + value.substring(2);
            }
        } else if (name === "cvv") {
            value = value.replace(/\D/g, "").substring(0, 3);
        }

        setPaymentData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (formData.fullName.trim().length < 3) newErrors.fullName = "Name too short";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email";
        if (formData.address.trim().length < 10) newErrors.address = "Please provide a complete address";
        if (formData.city.trim().length < 2) newErrors.city = "Invalid city";
        if (!formData.pincode.match(/^\d{6}$/)) newErrors.pincode = "Invalid PIN (6 digits)";

        const cleanCard = paymentData.cardNumber.replace(/\s/g, "");
        if (cleanCard.length !== 16) newErrors.cardNumber = "Must be 16 digits";
        if (!paymentData.expiry.match(/^\d{2}\/\d{2}$/)) newErrors.expiry = "Invalid format (MM/YY)";
        if (paymentData.cvv.length !== 3) newErrors.cvv = "Must be 3 digits";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const navigate = useNavigate();
    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            const firstError = document.querySelector(".text-red-500");
            firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            // Save order to localStorage
            const orderData = {
                orderId,
                items: [...items],
                totalPrice,
                shippingInfo: { ...formData },
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: "Order Placed"
            };

            const existingOrders = JSON.parse(localStorage.getItem("qpharma_orders") || "[]");
            localStorage.setItem("qpharma_orders", JSON.stringify([...existingOrders, orderData]));

            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();

            // Redirect to track order after a short delay
            setTimeout(() => {
                navigate(`/track-order/${orderId}`);
            }, 1500);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#f8f7f3] flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-[500px] w-full bg-white rounded-[32px] p-10 shadow-xl border border-[#e8e8e8] text-center animate-in fade-in zoom-in duration-500">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#5B9740] shadow-2xl shadow-[#5B9740]/30 animate-bounce">
                            <CheckIcon />
                        </div>
                        <h1 style={titleFont} className="mb-4 text-[38px] font-bold text-[#1E4734]">Payment Successful!</h1>
                        <p className="text-[17px] text-[#4a5a42] mb-8 font-medium">
                            Thank you for choosing QPharma. Redirecting you to track your order...
                        </p>
                        <div className="w-full bg-[#f8f9fa] rounded-2xl p-6 border border-[#f0f0f0]">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#999] mb-1">Confirmation ID</p>
                            <p className="text-[24px] font-black text-[#1E4734]">{orderId}</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f3]">
            <Navbar />

            <div className="mx-auto max-w-[1180px] px-4 py-10 md:py-16">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <Link to="/productpage" className="flex items-center gap-2 text-sm font-medium text-[#4f7d22] transition-colors hover:text-[#1E4734]">
                            <BackIcon />
                            Back to Store
                        </Link>
                        <h1 style={titleFont} className="mt-4 text-[32px] font-bold text-[#1E4734] md:text-[42px]">Checkout</h1>
                    </div>
                    <div className="hidden text-right md:block">
                        <p className="text-sm font-medium text-[#999]">Order ID</p>
                        <p className="text-[18px] font-bold text-[#1E4734]">{orderId}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Left Side: Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handlePlaceOrder} className="space-y-8">
                            {/* Contact Info */}
                            <section>
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E4734] text-[14px] font-bold text-white">1</span>
                                    <h2 className="text-[20px] font-bold text-[#1E4734]">Contact Information</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-[#4a5a42]">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className={`w-full rounded-xl border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-[#d8e0cc] bg-white'} px-4 py-3 text-[15px] outline-none transition-all focus:border-[#7D9851] focus:ring-4 focus:ring-[#7D9851]/5`}
                                        />
                                        {errors.fullName && <p className="mt-1 text-[12px] font-medium text-red-500">{errors.fullName}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-[#4a5a42]">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            className={`w-full rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-[#d8e0cc] bg-white'} px-4 py-3 text-[15px] outline-none transition-all focus:border-[#7D9851] focus:ring-4 focus:ring-[#7D9851]/5`}
                                        />
                                        {errors.email && <p className="mt-1 text-[12px] font-medium text-red-500">{errors.email}</p>}
                                    </div>
                                </div>
                            </section>

                            {/* Shipping address */}
                            <section>
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E4734] text-[14px] font-bold text-white">2</span>
                                    <h2 className="text-[20px] font-bold text-[#1E4734]">Shipping Details</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-[#4a5a42]">Address</label>
                                        <input
                                            required
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="House no / Apartment name"
                                            className={`w-full rounded-xl border ${errors.address ? 'border-red-500 bg-red-50' : 'border-[#d8e0cc] bg-white'} px-4 py-3 text-[15px] outline-none transition-all focus:border-[#7D9851] focus:ring-4 focus:ring-[#7D9851]/5`}
                                        />
                                        {errors.address && <p className="mt-1 text-[12px] font-medium text-red-500">{errors.address}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-semibold text-[#4a5a42]">City</label>
                                            <input
                                                required
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="Bengaluru"
                                                className={`w-full rounded-xl border ${errors.city ? 'border-red-500 bg-red-50' : 'border-[#d8e0cc] bg-white'} px-4 py-3 text-[15px] outline-none transition-all focus:border-[#7D9851] focus:ring-4 focus:ring-[#7D9851]/5`}
                                            />
                                            {errors.city && <p className="mt-1 text-[12px] font-medium text-red-500">{errors.city}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-semibold text-[#4a5a42]">PIN Code</label>
                                            <input
                                                required
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                placeholder="560001"
                                                className={`w-full rounded-xl border ${errors.pincode ? 'border-red-500 bg-red-50' : 'border-[#d8e0cc] bg-white'} px-4 py-3 text-[15px] outline-none transition-all focus:border-[#7D9851] focus:ring-4 focus:ring-[#7D9851]/5`}
                                            />
                                            {errors.pincode && <p className="mt-1 text-[12px] font-medium text-red-500">{errors.pincode}</p>}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section>
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E4734] text-[14px] font-bold text-white">3</span>
                                    <h2 className="text-[20px] font-bold text-[#1E4734]">Payment Method</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-[#7D9851] bg-[#7D9851]/5 px-5 py-4 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#7D9851]">
                                                <div className="h-2.5 w-2.5 rounded-full bg-[#7D9851]"></div>
                                            </div>
                                            <span className="font-semibold text-[#1E4734]">Credit / Debit Card</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <img src="https://img.icons8.com/color/48/visa.png" className="h-6" alt="visa" />
                                            <img src="https://img.icons8.com/color/48/mastercard.png" className="h-6" alt="mastercard" />
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-[#d8e0cc] bg-white p-5">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[13px] font-semibold text-[#4a5a42]">Card Number</label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="cardNumber"
                                                    value={paymentData.cardNumber}
                                                    onChange={handlePaymentChange}
                                                    placeholder="XXXX XXXX XXXX XXXX"
                                                    className={`w-full rounded-lg border ${errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-[#eee] bg-[#fafafa]'} px-4 py-2.5 text-[15px] outline-none`}
                                                />
                                                {errors.cardNumber && <p className="text-[11px] font-medium text-red-500">{errors.cardNumber}</p>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[13px] font-semibold text-[#4a5a42]">Expiry</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        name="expiry"
                                                        value={paymentData.expiry}
                                                        onChange={handlePaymentChange}
                                                        placeholder="MM/YY"
                                                        className={`w-full rounded-lg border ${errors.expiry ? 'border-red-500 bg-red-50' : 'border-[#eee] bg-[#fafafa]'} px-4 py-2.5 text-[15px] outline-none`}
                                                    />
                                                    {errors.expiry && <p className="text-[11px] font-medium text-red-500">{errors.expiry}</p>}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[13px] font-semibold text-[#4a5a42]">CVV</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        name="cvv"
                                                        value={paymentData.cvv}
                                                        onChange={handlePaymentChange}
                                                        placeholder="***"
                                                        className={`w-full rounded-lg border ${errors.cvv ? 'border-red-500 bg-red-50' : 'border-[#eee] bg-[#fafafa]'} px-4 py-2.5 text-[15px] outline-none`}
                                                    />
                                                    {errors.cvv && <p className="text-[11px] font-medium text-red-500">{errors.cvv}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <button
                                disabled={isProcessing || items.length === 0}
                                type="submit"
                                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#1E4734] py-4 text-[17px] font-bold text-white shadow-xl shadow-[#1E4734]/20 transition-all hover:bg-[#153325] disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                ) : (
                                    <>
                                        <LockIcon />
                                        Pay ₹{(totalPrice + 40).toFixed(2)}
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 rounded-3xl border border-[#d8e0cc] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] md:p-8">
                            <h3 className="mb-6 text-[22px] font-bold text-[#1E4734]">Order Summary</h3>

                            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
                                {items.length === 0 ? (
                                    <p className="text-center text-[#999] py-10">Your cart is empty</p>
                                ) : (
                                    items.map((item) => (
                                        <div key={`${item.category}-${item.id}`} className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 shrink-0 flex items-center justify-center rounded-xl bg-[#f5f6f2] p-2 border border-[#f0f0f0]">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="h-full w-full object-contain" />
                                                ) : (
                                                    <div className="h-10 w-10 opacity-40">
                                                        <svg viewBox="0 0 24 24" fill="currentColor" className="text-[#1E4734]">
                                                            <path d="M20,6 L16,6 L16,5 C16,3.34 14.66,2 13,2 L11,2 C9.34,2 8,3.34 8,5 L8,6 L4,6 C2.9,6 2,6.9 2,8 L2,19 C2,20.1 2.9,21 4,21 L20,21 C21.1,21 22,20.1 22,19 L22,8 C22,6.9 21.1,6 20,6 Z M10,5 C10,4.45 10.45,4 11,4 L13,4 C13.55,4 14,4.45 14,5 L14,6 L10,6 L10,5 Z M7,12 L7,10 L9,10 L9,12 L11,12 L11,10 L13,10 L13,12 L15,12 L15,10 L17,10 L17,12 L19,12 L19,14 L17,14 L17,16 L15,16 L15,14 L13,14 L13,16 L11,16 L11,14 L9,14 L9,16 L7,16 L7,14 L5,14 L5,12 L7,12 Z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#7D9851] text-[10px] font-bold text-white">{item.quantity}</span>
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <h4 className="truncate text-[14px] font-bold text-[#1E4734]">{item.title}</h4>
                                                <p className="text-[12px] text-[#999] uppercase tracking-wider">{item.category}</p>
                                            </div>
                                            <span className="text-[15px] font-bold text-[#1E4734]">{item.price}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="space-y-3 border-t border-[#f0f0f0] pt-6">
                                <div className="flex justify-between text-[15px]">
                                    <span className="text-[#666]">Subtotal</span>
                                    <span className="font-semibold text-[#1E4734]">₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[15px]">
                                    <span className="text-[#666]">Shipping</span>
                                    <span className="font-semibold text-[#4a8c2a]">₹40.00</span>
                                </div>
                                <div className="flex justify-between text-[15px] text-[#4a8c2a] font-medium">
                                    <span>Discount</span>
                                    <span>-₹0.00</span>
                                </div>
                                <div className="mt-4 flex justify-between border-t border-[#1E4734]/10 pt-4 text-[20px] font-bold">
                                    <span className="text-[#1E4734]">Total</span>
                                    <span className="text-[#1E4734]">₹{(totalPrice + 40).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#f0f4e8] px-4 py-3 text-[12px] font-medium text-[#4f7d22]">
                                <LockIcon />
                                <span>SSL Encrypted Secure Connection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d8e0cc;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #7D9851;
                }
            `}</style>
        </div>
    );
}
