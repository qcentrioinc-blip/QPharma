import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Global/Navbar";
import Footer from "../Global/Footer";



const TrackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);



export default function TrackOrder() {
    const { orderId: paramOrderId } = useParams<{ orderId: string }>();
    const [orderId, setOrderId] = useState(paramOrderId || "");
    const [contact, setContact] = useState("");
    const [showResults, setShowResults] = useState(!!paramOrderId);

    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState("");

    const getTimeline = (status: string, date: string) => [
        {
            label: "Order Placed",
            date: date,
            completed: true,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                    <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        },
        {
            label: "Processing",
            date: status === "Processing" || status === "Shipped" || status === "Delivered" ? date : "Pending",
            completed: status === "Processing" || status === "Shipped" || status === "Delivered",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
            )
        },
        {
            label: "Shipped",
            date: status === "Shipped" || status === "Delivered" ? date : "Pending",
            completed: status === "Shipped" || status === "Delivered",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
            )
        },
        {
            label: "Out for Delivery",
            date: status === "Delivered" ? date : "Pending",
            completed: status === "Delivered",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
            )
        },
        {
            label: "Delivered",
            date: status === "Delivered" ? date : "Pending",
            completed: status === "Delivered",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            )
        },
    ];

    const handleTrack = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError("");

        if (!orderId || !contact) {
            setError("Please enter both Order ID and Email/Phone");
            return;
        }

        const existingOrders = JSON.parse(localStorage.getItem("qpharma_orders") || "[]");
        const foundOrder = existingOrders.find((o: any) =>
            o.orderId === orderId && (o.shippingInfo.email === contact || o.shippingInfo.phone === contact)
        );

        if (foundOrder) {
            setOrder(foundOrder);
            setShowResults(true);
        } else {
            setError("No order found with these details. Please check and try again.");
            setShowResults(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="mx-auto max-w-[1000px] px-6 py-16">
                <div className="mb-12 text-center">
                    <h1 className="text-[48px] font-bold text-black mb-2" style={{ fontWeight: 800 }}>Track your order</h1>
                    <p className="text-[20px] text-gray-400">Enter your order details to track its status</p>
                </div>

                {/* Input Card */}
                <div className="mb-12 rounded-[20px] border border-gray-100 bg-white p-8 shadow-[0_2px_15px_rgba(0,0,0,0.05)]">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row items-end gap-6">
                        <div className="flex-1 space-y-2 w-full">
                            <label className="text-[16px] font-bold text-black">Order id</label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter your order ID"
                                className="w-full rounded-xl border border-gray-300 px-6 py-4 text-[16px] outline-none transition-all focus:border-[#5B9740]"
                            />
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                            <label className="text-[16px] font-bold text-black">Email or Phone Number</label>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Enter your order ID" // As per screenshot placeholder
                                className="w-full rounded-xl border border-gray-300 px-6 py-4 text-[16px] outline-none transition-all focus:border-[#5B9740]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#5B9740] px-8 py-4 text-[16px] font-bold text-white transition-all hover:bg-[#4a7c34] md:w-auto w-full"
                        >
                            <TrackIcon />
                            Track Order
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="mb-8 rounded-xl bg-red-50 p-4 text-center text-red-600 font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {showResults && order && (
                    <div className="space-y-8">
                        {/* Timeline Card */}
                        <div className="rounded-[20px] border border-gray-100 bg-white p-10 shadow-[0_2px_15px_rgba(0,0,0,0.05)]">
                            <div className="mb-10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-[28px] font-bold text-black">order #{order.orderId}</h2>
                                    <p className="text-[16px] text-gray-400 mt-1">Placed on {order.date}</p>
                                </div>
                                <div className="rounded-full bg-[#E1F7E3] px-6 py-2 text-[16px] font-bold text-[#5B9740]">
                                    {order.status}
                                </div>
                            </div>

                            <div className="relative mt-8 px-4">
                                {/* Connection Line */}
                                <div className="absolute top-[22px] left-[10%] right-[10%] h-[3px] bg-[#E1F7E3]"></div>

                                <div className="relative flex justify-between">
                                    {getTimeline(order.status, order.date).map((step, idx) => (
                                        <div key={idx} className="flex flex-col items-center text-center relative z-10">
                                            <div className={`flex h-[44px] w-[44px] items-center justify-center rounded-full border-4 border-white ${step.completed ? 'bg-[#5B9740]' : 'bg-gray-200'}`}>
                                                <div className="text-white">
                                                    {step.icon}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <p className={`text-[14px] font-bold ${step.completed ? 'text-black' : 'text-gray-300'}`}>{step.label}</p>
                                                <p className="text-[12px] text-gray-400 mt-1">{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Order Details */}
                            <div className="rounded-[20px] border border-gray-100 bg-white p-8 shadow-[0_2px_15px_rgba(0,0,0,0.05)]">
                                <h3 className="mb-6 text-[22px] font-bold text-black">Order Details</h3>
                                <div className="max-h-[440px] overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-4">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="rounded-2xl bg-[#F4F6F5] p-6 hover:shadow-md transition-shadow">
                                            <div className="flex gap-6">
                                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white p-2 border border-gray-100 shadow-sm">
                                                    <img src={item.image || "https://img.icons8.com/color/96/pill-bottle.png"} alt={item.title} className="h-16 w-16 object-contain" />
                                                </div>
                                                <div className="flex w-full flex-col">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="text-[17px] font-bold text-black line-clamp-1">{item.title}</h4>
                                                            <p className="text-[12px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">{item.category}</p>
                                                        </div>
                                                        <span className="text-[17px] font-bold text-black">{item.price}</span>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <p className="text-[14px] font-bold text-black text-opacity-70">Qty : {item.quantity}</p>
                                                        <div className="h-2 w-2 rounded-full bg-[#5B9740]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-5 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                                    <span className="text-[18px] font-bold text-black">Total Paid</span>
                                    <span className="text-[22px] font-bold text-[#5B9740]">₹{(order.totalPrice + 40).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="rounded-[20px] border border-gray-100 bg-white p-8 shadow-[0_2px_15px_rgba(0,0,0,0.05)]">
                                <h3 className="mb-6 text-[22px] font-bold text-black">Shipping Address</h3>
                                <div className="space-y-2">
                                    <p className="text-[18px] font-extrabold text-black">{order.shippingInfo.fullName}</p>
                                    <p className="text-[16px] font-semibold text-gray-600">{order.shippingInfo.address}</p>
                                    <p className="text-[16px] font-semibold text-gray-600">{order.shippingInfo.city}, {order.shippingInfo.pincode}</p>
                                    <p className="text-[16px] font-extrabold text-[#5B9740] mt-2">{order.shippingInfo.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            <Footer />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E1F7E3;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #5B9740;
                }
            `}</style>
        </div>
    );
}
