import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa";

const Content = () => {
  return (
    <div className="w-full bg-[#f5f5f5]">

      {/* ───────────────── Breadcrumb ───────────────── */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-md px-5 py-4 text-sm text-gray-500 shadow-sm">
          Home <span className="mx-2">/</span> Shop{" "}
          <span className="mx-2">/</span>
          <span className="text-black font-semibold">Contact</span>
        </div>
      </div>

      {/* ───────────────── Contact Section ───────────────── */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-md shadow-sm p-4 sm:p-6 lg:p-8">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black uppercase mb-3">
              Ready To Work With Us
            </h2>

            <p className="text-gray-500  mt-10 text-sm sm:text-base">
              Contact us for all your questions and opinions
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.5fr] gap-8">

            {/* ───────────── Left Form ───────────── */}
            <div className="lg:col-span-2">
              <form className="space-y-5">

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>

                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country / Region{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <select className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 bg-white">
                    <option>United States (US)</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>

                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>

                  <textarea
                    rows={5}
                    placeholder="Note about your order, e.g. special note for delivery"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 resize-none"
                  />
                </div>

                {/* Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 accent-green-700"
                  />

                  <p className="text-sm text-gray-500 leading-relaxed">
                    I want to receive news and updates once in a while. By
                    submitting, I'm agreed to the{" "}
                    <span className="text-green-700 underline cursor-pointer">
                      Terms & Conditions
                    </span>
                  </p>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="bg-[#5e8d49] hover:bg-[#4f793d] transition-all text-white text-sm font-semibold px-8 py-3 rounded-md"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>

            {/* ───────────── Right Info ───────────── */}
            <div className="space-y-6">

              {/* Contact Card */}
              <div className="bg-[#EDEFF6] rounded-lg p-6">

                {/* USA */}
                <div className="mb-8">
                  <p className="text-xs uppercase text-gray-400 mb-3">
                    United States Head Quarter
                  </p>

                  <p className="text-sm text-gray-700 leading-7">
                    152 Thatcher Road St, Manhattan, 10463, US
                  </p>

                  <p className="text-sm text-gray-700 mt-2">
                    +(025) 3886 25 16
                  </p>

                  <p className="text-sm text-[#1ABA1A] underline mt-2">
                    hello@company.com
                  </p>
                </div>

                {/* UK */}
                <div className="mb-8">
                  <p className="text-xs uppercase text-gray-400 mb-3">
                    United Kingdom Branch
                  </p>

                  <p className="text-sm text-gray-700 leading-7">
                    12 Buckingham Rd, Thornthwaite, HG3 4TY, UK
                  </p>

                  <p className="text-sm text-gray-700 mt-2">
                    +(718) 895-5350
                  </p>

                  <p className="text-sm text-[#1ABA1A] mt-2">
                    contact@company.co.uk
                  </p>
                </div>

                {/* Social Icons */}
                  <div className="flex flex-wrap items-center gap-4 pt-8">

      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm cursor-pointer hover:bg-[#5e8d49] hover:text-white transition-all duration-300">
        <FaTwitter size={14} />
      </div>

      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm cursor-pointer hover:bg-[#5e8d49] hover:text-white transition-all duration-300">
        <FaFacebookF size={14} />
      </div>

      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm cursor-pointer hover:bg-[#5e8d49] hover:text-white transition-all duration-300">
        <FaInstagram size={14} />
      </div>

      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm cursor-pointer hover:bg-[#5e8d49] hover:text-white transition-all duration-300">
        <FaYoutube size={14} />
      </div>

      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm cursor-pointer hover:bg-[#5e8d49] hover:text-white transition-all duration-300">
        <FaPinterestP size={14} />
      </div>

    </div>
  </div>
              
              {/* Image */}
              <div className="overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                  alt="Contact"
                  className="w-full h-[250px] sm:h-[300px] object-cover"
                />
              </div>
              </div>

            </div>
          </div>
        </div>
       

      {/* ───────────────── Map Section ───────────────── */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-white rounded-md shadow-sm p-4 sm:p-6">

          <h3 className="text-lg sm:text-xl font-bold text-black uppercase mb-5">
            Find Us On Google Map
          </h3>

          <div className="overflow-hidden rounded-lg">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=New+York+City&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;